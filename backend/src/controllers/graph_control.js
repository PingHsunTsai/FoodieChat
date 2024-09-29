const fs = require('fs');
const path = require('path');
const { Friend, User }  = require('../models');

const INF = 2147483647;

class Graph {
  constructor() {
    this.friendsAdjList = new Map();
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
    });
  }

  updateGraph = async () => {
    await this.fetchData();
    await this.friendGraph();

    const dijkstrMap = Object.fromEntries(this.dijkstra(this.friendsAdjList, this.startUserIds));
    const objAdjList = Object.fromEntries(this.friendsAdjList);

    const outputGraph = {
        adjList: objAdjList,
        dijkstrMap: dijkstrMap,
    };

    return outputGraph;
  }

  friendGraph = async () => {


    this.friends.forEach((friend) => {
        const user1 = this.userMap.get(friend.userId);
        const user2 = this.userMap.get(friend.friendId);

        if (user1 && user2) {
            const weight = this.calculateWeight(user1, user2, true);
            this.addEdge(this.friendsAdjList, friend.userId, friend.friendId, weight);
        }
    });

    console.log('friendGraph updated successfully.');
  };

  calculateWeight = (user1, user2, friend) => {
    let weight = 0;

    if (friend) {
        weight += 2;
    }
    
    if (String(user1.favoriteFood) === String(user2.favoriteFood)) {
        weight += 1;
    }
    if (String(user1.favoriteDrink) === String(user2.favoriteDrink)) {
        weight += 1;
    }
    if (String(user1.livingCountry) === String(user2.livingCountry)) {
        weight += 1;
    }

    return weight;
  };

  addVertex = (adjList, v) => {
    adjList.set(v, []);
  }

  addEdge = (adjList, v, w, weight) =>{
    if (!adjList.has(v)) this.addVertex(adjList, v);
    // if (!this.adjList.has(w)) this.addVertex(w);

    if (!adjList.get(v).find((neighbor) => neighbor.node === w)) {
        adjList.get(v).push({ node: w, weight })
    };
    // if (!this.adjList.get(w).find((neighbor) => neighbor.node === v)) {
    //     this.adjList.get(w).push({ node: v, weight })
    // };
    console.log(`Added edge between ${v} and ${w} with weight ${weight}`);
  }

  dijkstra = (adjList, start) => {
    const dist = new Map();
    const visited = new Map();
    var queue = [];

    adjList.forEach((_, key) => {
      dist.set(key, INF);
      visited.set(key, false);
    });

    dist.set(start, 0);
    queue.push(start);

    while (queue.length != 0) {
      const u = queue.shift();

      if (visited.get(u)) continue;
      visited.set(u, true);

      adjList.get(u).forEach((neighbor) => {
        const { node: v, weight } = neighbor;
        if (dist.get(v) > dist.get(u) + weight) {
          dist.set(v, dist.get(u) + weight);
          queue.push(v);
        }
      });
    }

    return dist;
  }

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