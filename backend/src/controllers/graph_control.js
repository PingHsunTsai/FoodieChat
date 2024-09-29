const fs = require('fs');
const path = require('path');
const { Friend, User }  = require('../models');

const INF = 2147483647;

class Graph {
  constructor() {
    this.adjList = new Map();
    this.startUserIds = 2;
    this.users = [];
    this.userMap = new Map();
    this.friends = [];
    this.visitedFriends = new Map();
  }

  fetchData = async () => {
    this.users = await User.findAll();
    this.friends = await Friend.findAll({
        include: [{ model: User, as: 'friend' }]
    });

    this.users.forEach(user => {
        this.userMap.set(user.id, user);
        this.visitedFriends.set(user.id, false);
        this.addVertex(user.id);
    });
  }

  updateGraph = async () => {
    await this.fetchData();
    this.friendGraph();

    const dfsMap = this.dfs(this.startUserIds);
    const dijkstrMap = Object.fromEntries(this.dijkstra(this.startUserIds));
    const objAdjList = Object.fromEntries(this.adjList);

    const outputGraph = {
        adjList: objAdjList,
        dijkstrMap: dijkstrMap,
        dfsMap: dfsMap
    };

    return outputGraph;
  }

  friendGraph = () => {

    this.friends.forEach((friend) => {
        const user1 = this.userMap.get(friend.userId);
        const user2 = this.userMap.get(friend.friendId);

        if (user1 && user2) {
            const weight = this.calculateWeight(user1, user2);
            this.addEdge(friend.userId, friend.friendId, weight);
        }
    });
    console.log('friendGraph updated successfully.');
  };

  strangersGraph = async () => {
    console.error('Not Implemented Error');
  };

  calculateWeight = (user1, user2) => {
    let weight = 4;
    
    if (String(user1.favoriteFood) === String(user2.favoriteFood)) {
        weight -= 1;
    }
    if (String(user1.favoriteDrink) === String(user2.favoriteDrink)) {
        weight -= 1;
    }
    if (String(user1.livingCountry) === String(user2.livingCountry)) {
        weight -= 1;
    }

    return weight;
  };

  addVertex = (v) => {
    this.adjList.set(v, []);
  }

  addEdge = (v, w, weight) =>{
    if (!this.adjList.has(v)) this.addVertex(v);
    if (!this.adjList.has(w)) this.addVertex(w);

    if (!this.adjList.get(v).find((neighbor) => neighbor.node === w)) {
        this.adjList.get(v).push({ node: w, weight })
    };
    if (!this.adjList.get(w).find((neighbor) => neighbor.node === v)) {
        this.adjList.get(w).push({ node: v, weight })
    };
    console.log(`Added edge between ${v} and ${w} with weight ${weight}`);
  }

  dijkstra = (start) => {
    //bfs with weight
    const dist = new Map();
    const visited = new Map();
    var queue = [];

    this.adjList.forEach((_, key) => {
      dist.set(key, INF);
      visited.set(key, false);
    });

    dist.set(start, 0);
    queue.push(start);

    while (queue.length != 0) {
      const u = queue.shift();

      if (visited.get(u)) continue;
      visited.set(u, true);

      this.adjList.get(u).forEach((neighbor) => {
        const { node: v, weight } = neighbor;
        if (dist.get(v) > dist.get(u) + weight) {
          dist.set(v, dist.get(u) + weight);
          queue.push(v);
        }
      });
    }

    return dist;
  }

  dfs = (start) => {
    
    const dfsMap = [];

    function dfsRec(adjList, start, visited) {
      visited.set(start, true);
      console.log('dfs',start);
      dfsMap.push(start);

      adjList.get(start).forEach((neighbor) => {
        if (!visited.get(neighbor.node)) {
          dfsRec(adjList, neighbor.node, visited);
        }
      });
    }

    const visited = new Map();
    this.adjList.forEach((_, key) => visited.set(key, false));
    dfsRec(this.adjList, start, visited);

    return dfsMap;
  };

  dumpGraph = async () => {
    const filePath = path.join(process.env.GRAPH_JSON_PATH, 'graph.json');

    const outputGraph = await this.updateGraph();

    fs.writeFile(filePath, JSON.stringify(outputGraph, null, 2), (err) => {
        if (err) {
            console.error('Error writing statistics file:', err);
        } else {
            console.log('Graph statistics written to', filePath);
        }
    });
  }
}

module.exports = { Graph };