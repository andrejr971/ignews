import { useEffect, useState } from "react"

export function Async() {
  const [isButtonInVisible, setIsButtonInVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonInVisible(true)
    }, 1000);
  }, [])

  return (
    <div>
      <div>Hello world</div>
      {!isButtonInVisible && <button>Button</button>}
    </div>
  )
}