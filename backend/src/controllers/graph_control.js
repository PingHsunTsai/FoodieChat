const fs = require('fs');
const path = require('path');
const { Friend, User }  = require('../models');

const INF = 2147483647;
const FILEPATH = path.join(process.env.GRAPH_JSON_PATH, 'graph.json');

class MinHeap {
    constructor() {
        //node = [weight, node]
        this.heap = [];
    }

    push(val) {
        this.heap.push(val);
        this.bubbleUp();
    }

    pop() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown();
        }
        return min;
    }

    bubbleUp() {
        let idx = this.heap.length - 1;
        const element = this.heap[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.heap[parentIdx];
            if (element[0] >= parent[0]) break;
            this.heap[parentIdx] = element;
            this.heap[idx] = parent;
            idx = parentIdx;
        }
    }
    bubbleDown() {
        let idx = 0;
        const length = this.heap.length;
        const element = this.heap[0];
        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;
            if (leftChildIdx < length) {
                leftChild = this.heap[leftChildIdx];
                if (leftChild[0] < element[0]) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.heap[rightChildIdx];
                if (
                    (swap === null && rightChild[0] < element) || 
                    (swap !== null && rightChild[0] < leftChild)
                ) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null) break;
            this.heap[idx] = this.heap[swap];
            this.heap[swap] = element;
            idx = swap;
        }
    }
}
class Graph {
    
    constructor() {

        if (Graph.instance) {
            return Graph.instance;
        }

        this._adjList = new Map();
        this._startUserIds = 2;
        this.users = [];
        this.friends = [];
        this.userMap = new Map();
        this._dfsList = [];
        this._dijkstraList = [];
        this._outputGraph = {};
        this.fetchData();

        Graph.instance = this;

    };

    get startUserIds() {
        return this._startUserIds;
    };

    set startUserIds(value) {
        this._startUserIds = value;
        this.updateStatistics();
    };

    get dfsList() {
        return this._dfsList;
    };

    set dfsList(value) {
        this._dfsList = value;
    };

    get dijkstraList() {
        return this._dijkstraList;
    };

    set dijkstraList(value) {
        this._dijkstraList = value;
    };

    async fetchData() {
        const [users, friends] = await Promise.all([
        User.findAll({
            include: [{
                model: Friend,
                as: 'friends',
                attributes: ['friendId'] ,
            }]
        }),
        Friend.findAll({ include: [{ model: User, as: 'friend' }] }),
        ]);
        
        this.users = users;
        this.friends = friends;

        this.users.forEach(user => {
            // Add user to userMap to easily access user by id without searching
            this.userMap.set(user.id, user);
            // Add user to graph
            this.addVertex(user.id);
        });

        this.updateFriendRelation();
        await this.updateStatistics();
    }

    async updateStatistics() {
        const dfsList = this.dfs(this.startUserIds);
        const dijkstraList = this.dijkstra(this.startUserIds);
        const adjMap = Object.fromEntries(this._adjList);

        this._outputGraph = {
            adjMap,
            dijkstraList,
            dfsList,
        };
    }

    updateFriendRelation() {
        this.friends.forEach((friend) => {
          const user1 = this.userMap.get(friend.userId);
          const user2 = this.userMap.get(friend.friendId);
    
          if (user1 && user2) {
            const weight = this.calculateWeight(user1, user2);
            this.addEdge(friend.userId, friend.friendId, weight);
          }
        });
        console.log('Friend relationships updated.');
      }

    calculateWeight(user1, user2) {
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
    }

    async addUser(userId) {
        this.addVertex(userId);
        await this.dumpGraph();
    }

    async addFriend(userId, friendId) {
        const weight = this.calculateWeight(userId, friendId);
        this.addEdge(userId, friendId, weight);
        await this.dumpGraph();
    }

    addVertex(v) {
        if (!this._adjList.has(v)) {
          this._adjList.set(v, []);
        }
    }

    addEdge(v, w, weight) {
        if (!this._adjList.has(v)) this.addVertex(v);
        if (!this._adjList.has(w)) this.addVertex(w);
    
        if (!this._adjList.get(v).find((neighbor) => neighbor.node === w)) {
          this._adjList.get(v).push({ node: w, weight });
        }
        if (!this._adjList.get(w).find((neighbor) => neighbor.node === v)) {
          this._adjList.get(w).push({ node: v, weight });
        }
        console.log(`Added edge between ${v} and ${w} with weight ${weight}`);
    }

    sortMap(map) {
        // Convert Map to array of [key, value] pairs
        const sortedArray = Array.from(map)
            .sort((a, b) => a[1] - b[1])
            .map(([key, _]) => key); ;
        return sortedArray;
    }

    // Dijkstra's algorithm for shortest path
    dijkstra(start, k=5) {
        const start_user = this.userMap.get(start);
        const friends = start_user.friends.map(friend => friend.friendId);
        const dist = new Map();
        const visited = new Map();
        const queue = [];

        this._adjList.forEach((_, key) => {
            dist.set(key, INF);
            visited.set(key, false);
        });

        dist.set(start, 0);
        // priority queue
        const minHeap = new MinHeap();
        minHeap.push([0, start]);
        
        while (minHeap.heap.length !== 0) {
            
            let [ _, u ] = minHeap.pop();

            if (visited.get(u)) continue;
            visited.set(u, true);

            this._adjList.get(u).forEach((neighbor) => {
                const { node: v, weight } = neighbor;
                
                if (dist.get(v) > dist.get(u) + weight) {
                    dist.set(v, dist.get(u) + weight);
                    minHeap.push([dist.get(v), v]);
                }
            });
        }

        this.dijkstraList = this.sortMap(dist)
            .filter((id) => !friends.includes(id) && id !== start)

        return this.dijkstraList;
    }

    // Depth-first search algorithm
    dfs(start) {
        const dfsMap = [];

        const dfsRec = (adjList, start, visited) => {
            visited.set(start, true);
            dfsMap.push(start);

            adjList.get(start).forEach((neighbor) => {
                if (!visited.get(neighbor.node)) {
                dfsRec(adjList, neighbor.node, visited);
                }
            });
        };

        const visited = new Map();
        this._adjList.forEach((_, key) => visited.set(key, false));
        dfsRec(this._adjList, start, visited);

        this._dfsList = dfsMap;
        return this._dfsList;
    }


    async dumpGraph() {
        await this.updateStatistics();

        fs.writeFile(FILEPATH, JSON.stringify(this._outputGraph, null, 2), (err) => {
        if (err) {
            console.error('Error writing statistics file:', err);
        } else {
            console.log('Graph statistics written to', FILEPATH);
        }
        });
    }

    async loadGraph() {
        try {
          const data = fs.readFileSync(FILEPATH, 'utf-8');
          const parsedData = JSON.parse(data);
    
          this._adjList = new Map(
            Object.entries(parsedData.adjMap).map(([key, value]) => [parseInt(key), value])
          );
    
          this._dijkstraList = parsedData.dijkstraList;
          this._dfsList = parsedData.dfsList;
        } catch (err) {
          console.error('Error loading graph from file:', err);
        }
    }
}

const graphInstance = new Graph();
setInterval(graphInstance.dumpGraph, 24 * 60 * 60 * 1000);

module.exports = graphInstance;