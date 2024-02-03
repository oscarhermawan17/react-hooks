// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// function DelayedCounter() {
//   const [count, setCount] = React.useState(0)
//   console.log('DelayedCounter', count)
//   function increment() {
//     setTimeout(() => {
//       console.log('increment', count)
//       setCount(count + 1)
//     }, 2000)
//   }
//   return <button onClick={increment}>{count}</button>
// }

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    if (window.localStorage.getItem(key)) {
      return deserialize(window.localStorage.getItem(key))
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [state, setState] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setState(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={state} onChange={handleChange} id="name" />
      </form>
      {state ? <strong>Hello {state}</strong> : 'Please type your name'}
      {/* <DelayedCounter /> */}
    </div>
  )
}

function App() {
  return <Greeting initialName={() => 'oke'} />
}

export default App
