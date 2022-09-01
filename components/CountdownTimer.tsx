import React from "react"
import { useContract, useContractData } from "@thirdweb-dev/react"
import Countdown from "react-countdown"

type Props = {
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}

function CountdownTimer() {
  // contract address
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  )

  // expiration
  const { data: expiration } = useContractData(contract, "expiration")

  //renderer
  const renderer = ({ hours, minutes, seconds, completed }: Props) => {
    if (completed) {
      return (
        <div>
          <h2 className="text-white text-xl text-center animate-pulse">
            Ticket Sales has now closed for this draw
          </h2>
          <div className="flex space-x-6">
            <div className="flex-1">
              <div className="countdown animate-pulse">{hours}</div>
              <div className="countdown-label">hours</div>
            </div>

            <div className="flex-1">
              <div className="countdown animate-pulse">{minutes}</div>
              <div className="countdown-label">minutes</div>
            </div>

            <div className="flex-1">
              <div className="countdown animate-pulse">{seconds}</div>
              <div className="countdown-label">seconds</div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <h3 className="text-white text-sm mn-2 italic">Time Remaining</h3>
          <div className="flex space-x-6">
            <div className="flex-1">
              <div className="countdown">{hours}</div>
              <div className="countdown-label">hours</div>
            </div>

            <div className="flex-1">
              <div className="countdown">{minutes}</div>
              <div className="countdown-label">minutes</div>
            </div>

            <div className="flex-1">
              <div className="countdown">{seconds}</div>
              <div className="countdown-label">seconds</div>
            </div>
          </div>
        </div>
      )
    }
  }
  return (
    <div>
      <Countdown date={new Date(expiration * 1000)} renderer={renderer} />
    </div>
  )
}

export default CountdownTimer
