import {HandlerPerformanceMap, TrafficData} from './types'
  
const performanceMap: HandlerPerformanceMap = new Map();
performanceMap.set("GetSampleHandler", [
  // points are diurnal
  // Nighttime (low QPS)
  { timestamp: 1695733200000, qps: 20 },
  { timestamp: 1695733260000, qps: 15 },
  { timestamp: 1695733320000, qps: 22 },
  { timestamp: 1695733380000, qps: 18 },
  { timestamp: 1695733440000, qps: 25 },
  { timestamp: 1695733500000, qps: 17 },

  // Morning peak (high QPS)
  { timestamp: 1695734000000, qps: 150 },
  { timestamp: 1695734060000, qps: 180 },
  { timestamp: 1695734120000, qps: 175 },
  { timestamp: 1695734180000, qps: 160 },
  { timestamp: 1695734240000, qps: 190 },
  { timestamp: 1695734300000, qps: 185 },

  // Morning dip (medium QPS)
  { timestamp: 1695735000000, qps: 100 },
  { timestamp: 1695735060000, qps: 95 },
  { timestamp: 1695735120000, qps: 110 },
  { timestamp: 1695735180000, qps: 90 },
  { timestamp: 1695735240000, qps: 105 },
  { timestamp: 1695735300000, qps: 98 },

  // Afternoon peak (high QPS)
  { timestamp: 1695736000000, qps: 160 },
  { timestamp: 1695736060000, qps: 170 },
  { timestamp: 1695736120000, qps: 155 },
  { timestamp: 1695736180000, qps: 165 },
  { timestamp: 1695736240000, qps: 175 },
  { timestamp: 1695736300000, qps: 168 },

  // Evening dip (medium QPS)
  { timestamp: 1695737000000, qps: 90 },
  { timestamp: 1695737060000, qps: 100 },
  { timestamp: 1695737120000, qps: 85 },
  { timestamp: 1695737180000, qps: 95 },
  { timestamp: 1695737240000, qps: 105 },
  { timestamp: 1695737300000, qps: 98 },

  // Nighttime (low QPS)
  { timestamp: 1695740000000, qps: 25 },
  { timestamp: 1695740060000, qps: 20 },
  { timestamp: 1695740120000, qps: 22 },
  { timestamp: 1695740180000, qps: 18 },
  { timestamp: 1695740240000, qps: 25 },
  { timestamp: 1695740300000, qps: 17 },
]);


export function getTrafficData(name : string) : TrafficData[] {
    if (performanceMap.has(name)) {
        return performanceMap.get(name)
    }
    return []
}