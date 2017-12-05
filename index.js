const {HalumiCore} = require("halumi-core")
const util = require('util')

const halumiCore = new HalumiCore({host: 'localhost', port: 8081})

const wait = util.promisify(setTimeout)
const comprehend = util.promisify((...args) => halumiCore.comprehend(...args))


async function start(texts, patterns) {

  console.log('接続を待ちます...')
  while(halumiCore.status !== 'ready') {
    await wait(100)
  }

  for (let text of texts) {
    console.log(`> ${text}`)
    const results = await comprehend(text, patterns)
    if (!results) continue;
    for (let result of results.commands) {
      const {command, phrases, status, days} = result
      console.log(`${command}: ${phrases.join(', ')} (${status})`)
      if (days.length) {
        console.log(`date: ${days.map((day) => new Date(day)).join(', ')}`)
      }
    }
  }
  process.exit(0)
}


const patterns = {
  rest: [
    ['休み'],
    ['休み', '予定'],
    ['休む', '思う'],
  ],
  voyage: [
    ['旅行', '*', '予定']
  ]
}

const texts = [
  '明日と明後日は休みです',
  '明日は旅行にいくので休みの予定だよ',
  '12/25はクリスマスだから休もうと思う。'
]


start(texts, patterns)

