import { ClusterManager } from "discord-hybrid-sharding";
import console from './util/logger'
import * as path from 'path'

const {token} = require('../config.json')

const manager = new ClusterManager(path.resolve(__dirname,'bot.ts'),{
    totalShards: 'auto',
    shardsPerClusters:2,
    mode:'process',
    execArgv:['-r','ts-node/register'],
    token
})

manager.on('clusterCreate', cluster => console.log(`Launched cluster ${cluster.id}`));
(async () => {
    await manager.spawn({timeout:-1})
})()