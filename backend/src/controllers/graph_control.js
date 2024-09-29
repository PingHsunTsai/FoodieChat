const fs = require('fs');
const path = require('path');
const { Friend, User }  = require('../models');

const INF = 2147483647;

class Graph {
  constructor() {
    this.adjList = new Map();
    this.startUserIds = 1;
  }

  dumpGraph = async () => {
    const filePath = path.join(process.env.GRAPH_JSON_PATH, 'graph.json');

    await this.updateGraph();
    const dijkstrMap = Object.fromEntries(this.dijkstra(this.startUserIds));
    const objAdjList = Object.fromEntries(this.adjList);
    console.log('Dumping graph statistics to', objAdjList);
    console.log('Dumping graph distmap to', dijkstrMap);

    const outputGraph = {
        adjList: objAdjList,
        dijkstrMap: dijkstrMap,
    };

    fs.writeFile(filePath, JSON.stringify(outputGraph, null, 2), (err) => {
        if (err) {
            console.error('Error writing statistics file:', err);
        } else {
            console.log('Graph statistics written to', filePath);
        }
    });
  }

  updateGraph = async () => {
    // Fetch all users and friends in one go to reduce database queries
    const users = await User.findAll();
    const friends = await Friend.findAll({
        include: [{ model: User, as: 'friend' }]
    });

    // Create a map of users for quick lookups
    const userMap = new Map();
    users.forEach(user => {
        userMap.set(user.id, user);
    });

    friends.forEach((friend) => {
        const user1 = userMap.get(friend.userId);
        const user2 = userMap.get(friend.friendId);

        if (user1 && user2) {
            const weight = this.calculateWeight(user1, user2);
            this.addEdge(friend.userId, friend.friendId, weight);
        }
    });

    console.log('Graph updated successfully.');
};

  calculateWeight = (user1, user2) => {
    let weight = 1;
    if (String(user1.favoriteFood) === String(user2.favoriteFood)) {
        weight += 1;
    }
    if (String(user1.favoriteDrink) === String(user2.favoriteDrink)) {
        weight += 1;
    }
    if (String(user1.livingCountry) === String(user2.livingCountry)) {
        weight += 2;
    }

    return weight;
    };

  addVertex = (v) => {
    this.adjList.set(v, []);
  }

  addEdge = (v, w, weight) =>{
    if (!this.adjList.has(v)) this.addVertex(v);
    // if (!this.adjList.has(w)) this.addVertex(w);

    if (!this.adjList.get(v).find((neighbor) => neighbor.node === w)) {
        this.adjList.get(v).push({ node: w, weight })
    };
    // if (!this.adjList.get(w).find((neighbor) => neighbor.node === v)) {
    //     this.adjList.get(w).push({ node: v, weight })
    // };
    console.log(`Added edge between ${v} and ${w} with weight ${weight}`);
  }

  dijkstra = (start) => {
    const dist = new Map();
    const visited = new Map();
    var queue = [];

    this.adjList.forEach((_, key) => {
      dist.set(key, INF);
      visited.set(key, false);
    });

    dist.set(start, 0);
    queue.push(start);
    // pq.enqueue(start, 0);

    while (queue.length != 0) {
    //   const { element: u } = pq.dequeue();
      const u = queue.shift();

      if (visited.get(u)) continue;
      visited.set(u, true);

      this.adjList.get(u).forEach((neighbor) => {
        const { node: v, weight } = neighbor;
        if (dist.get(v) > dist.get(u) + weight) {
          dist.set(v, dist.get(u) + weight);
          queue.push(v);
        //   pq.enqueue(v, dist.get(v));
        }
      });
    }

    return dist;
  }
}

module.exports = { Graph };