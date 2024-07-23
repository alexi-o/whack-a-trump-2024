<template>
  <div>
    <div v-if="!gameStarted" class="intro">
      <h1>Whack-A-Trump!</h1>
      <input v-model="playerName" placeholder="Enter your name" />
      <button @click="startGame">Start Game</button>
    </div>
    <div v-else class="gameBoard">
      <div
        v-for="trump in trumps"
        :key="trump.id"
        :style="{ ...trump.style, top: trump.top + 'px', left: trump.left + 'px' }"
        class="trump"
        @click="whackTrump(trump)"
      >
        <img :src="trump.src" />
      </div>
      <div class="timer">Time: {{ timeLeft }} secs</div>
      <div class="score">Score: {{ score }}</div>
    </div>
    <div v-if="gameOver" class="gameOver">
      <h2>Game Over!</h2>
      <p>{{ playerName }} scored: {{ score }} points</p>
      <button @click="resetGame">Play Again</button>
      <h3>Leaderboard</h3>
      <ul>
        <li v-for="entry in leaderboard" :key="entry.id">{{ entry.name }}: {{ entry.score }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebaseConfig'
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore'

const playerName = ref('')
const score = ref(0)
const timeLeft = ref(20)
const gameStarted = ref(false)
const gameOver = ref(false)

const gameBoardWidth = 750
const gameBoardHeight = 420
const trumpWidth = 150
const trumpHeight = 150

const trumps = ref([
  {
    id: 1,
    src: new URL('@/assets/images/trump1.png', import.meta.url).href,
    top: 0,
    left: 0,
    style: { visibility: 'hidden' }
  },
  {
    id: 2,
    src: new URL('@/assets/images/trump2.png', import.meta.url).href,
    top: 0,
    left: 0,
    style: { visibility: 'hidden' }
  },
  {
    id: 3,
    src: new URL('@/assets/images/trump3.png', import.meta.url).href,
    top: 0,
    left: 0,
    style: { visibility: 'hidden' }
  },
  {
    id: 4,
    src: new URL('@/assets/images/trump1.png', import.meta.url).href,
    top: 0,
    left: 0,
    style: { visibility: 'hidden', transform: 'rotate(180deg)' }
  },
  {
    id: 5,
    src: new URL('@/assets/images/trump2.png', import.meta.url).href,
    top: 0,
    left: 0,
    style: { visibility: 'hidden', transform: 'rotate(90deg)' }
  },
  {
    id: 6,
    src: new URL('@/assets/images/trump3.png', import.meta.url).href,
    top: 0,
    left: 0,
    style: { visibility: 'hidden', transform: 'rotate(-90deg)' }
  }
])
const leaderboard = ref([])

const startGame = () => {
  gameStarted.value = true
  gameOver.value = false
  score.value = 0
  timeLeft.value = 20
  countDown()
  generateTrump()
}

const countDown = () => {
  const interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(interval)
      endGame()
    }
  }, 1000)
}

const generateTrump = () => {
  const interval = setInterval(() => {
    if (!gameStarted.value) {
      clearInterval(interval)
      return
    }
    const index = Math.floor(Math.random() * trumps.value.length)
    const top = Math.random() * (gameBoardHeight - trumpHeight)
    const left = Math.random() * (gameBoardWidth - trumpWidth)
    trumps.value[index].top = top
    trumps.value[index].left = left
    trumps.value[index].style.visibility = 'visible'
    setTimeout(() => {
      trumps.value[index].style.visibility = 'hidden'
    }, 2000)
  }, 500)
}

const whackTrump = (trump) => {
  trump.style.visibility = 'hidden'
  score.value++
}

const endGame = async () => {
  gameStarted.value = false
  gameOver.value = true
  await addDoc(collection(db, 'scores'), {
    name: playerName.value,
    score: score.value,
    timestamp: new Date()
  })
  fetchLeaderboard()
}

const resetGame = () => {
  gameStarted.value = false
  gameOver.value = false
  playerName.value = ''
}

const fetchLeaderboard = async () => {
  const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10))
  const querySnapshot = await getDocs(q)
  leaderboard.value = querySnapshot.docs.map((doc) => doc.data())
}

onMounted(fetchLeaderboard)
</script>

<style scoped>
.intro,
.gameOver {
  text-align: center;
}

.gameBoard {
  position: relative;
  width: 750px;
  height: 420px;
  background: url('@/assets/images/ovaloffice.png') no-repeat;
}

.trump {
  position: absolute;
  height: 150px;
  width: 150px;
}

.timer,
.score {
  font-size: 20px;
}
</style>
