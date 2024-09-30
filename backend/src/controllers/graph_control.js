const fs = require('fs');
const path = require('path');
const { Friend, User }  = require('../models');

const INF = 2147483647;
const FILEPATH = path.join(process.env.GRAPH_JSON_PATH, 'graph.json');
class Graph {
    
    constructor() {
        this._adjList = new Map();
        this._startUserIds = 2;
        this.users = [];
        this.friends = [];
        this.userMap = new Map();
        this._dfsList = [];
        this._dijkstraMap = new Map();
        this._outputGraph = {};
        this.loadGraph();
    };

    get startUserIds() {
        return this._startUserIds;
    };

    set startUserIds(value) {
        this._startUserIds = value;
        this.updateStatistics();
    };

    get afsList() {
        return this._dfsList;
    };

    set afsList(value) {
        this._dfsList = value;
    };

    get dijkstraMap() {
        return this._dijkstraMap;
    };

    set dijkstraMap(value) {
        this._dijkstraMap = value;
    };

    fetchData = async () => {
        this.users = await User.findAll();
        this.friends = await Friend.findAll({
            include: [{ model: User, as: 'friend' }]
        });

        this.users.forEach(user => {
            this.userMap.set(user.id, user);
            this.addVertex(user.id);
        });

        this.updateFriendRelation();
    };

    updateStatistics = async () => {

        const dfsMap = this.dfs(this.startUserIds);
        const dijkstrMap = Object.fromEntries(this.dijkstra(this.startUserIds));
        const objAdjList = Object.fromEntries(this._adjList);

        this._outputGraph = {
            adjList: objAdjList,
            dijkstrMap: dijkstrMap,
            dfsMap: dfsMap
        };
    };

    updateFriendRelation = () => {

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
        this._adjList.set(v, []);
    };

    addEdge = (v, w, weight) =>{
        if (!this._adjList.has(v)) this.addVertex(v);
        if (!this._adjList.has(w)) this.addVertex(w);

        if (!this._adjList.get(v).find((neighbor) => neighbor.node === w)) {
            this._adjList.get(v).push({ node: w, weight })
        };
        if (!this._adjList.get(w).find((neighbor) => neighbor.node === v)) {
            this._adjList.get(w).push({ node: v, weight })
        };
        console.log(`Added edge between ${v} and ${w} with weight ${weight}`);
    };

    dijkstra = (start) => {
        //bfs with weight
        const dist = new Map();
        const visited = new Map();
        var queue = [];

        this._adjList.forEach((_, key) => {
            dist.set(key, INF);
            visited.set(key, false);
        });

        dist.set(start, 0);
        queue.push(start);

        while (queue.length != 0) {
            const u = queue.shift();

            if (visited.get(u)) continue;
            visited.set(u, true);

            this._adjList.get(u).forEach((neighbor) => {
                const { node: v, weight } = neighbor;
                if (dist.get(v) > dist.get(u) + weight) {
                    dist.set(v, dist.get(u) + weight);
                    queue.push(v);
                }
            });
        }

        this.dijkstraMap = dist;
        return dist;
    };

    dfs = (start) => {
        
        const dfsMap = [];

        function dfsRec(adjList, start, visited) {
            visited.set(start, true);
            dfsMap.push(start);

            adjList.get(start).forEach((neighbor) => {
                if (!visited.get(neighbor.node)) {
                    dfsRec(adjList, neighbor.node, visited);
                }
            });
        }

        const visited = new Map();
        this._adjList.forEach((_, key) => visited.set(key, false));
        dfsRec(this._adjList, start, visited);
        
        this.dfsList = dfsMap;
        return dfsMap;
    };

    dumpGraph = async () => {
        await this.updateStatistics();

        fs.writeFile(FILEPATH, JSON.stringify(this._outputGraph, null, 2), (err) => {
            if (err) {
                console.error('Error writing statistics file:', err);
            } else {
                console.log('Graph statistics written to', FILEPATH);
            }
        });
    };

    loadGraph = async () => {
        try {
            const data = fs.readFileSync(FILEPATH, 'utf-8');
            const parsedData = JSON.parse(data);

            // Rebuild adjList
            this._adjList = new Map( 
                Object.entries(parsedData.adjList).map(([key, value]) => [parseInt(key), value])
            );
            console.log('adjList', this._adjList);

            this.dijkstraMap = new Map(Object.entries(parsedData.dijkstrMap));
            this.dfsList = parsedData.dfsMap;

        } catch (err) {
            console.error('Error loading graph from file:', err);
            return null;
        }
    };
}

module.exports = { Graph };