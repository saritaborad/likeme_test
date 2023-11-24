import {useEffect, useState} from 'react'
import {fetchAgents, fetchAllCountry, getPackageName} from '../ApiService/_requests'

export function useAllCountry(needCountry = true) {
  const [country, setAllCountry] = useState([])
  useEffect(() => {
    async function fetchData() {
      if (needCountry) {
        const {data} = await fetchAllCountry()
        setAllCountry(data.countries)
      }
    }

    fetchData()
  }, [])
  return country
}

export function useAllAgent(needAgent = true) {
  const [agents, setAllAgents] = useState([])
  useEffect(() => {
    async function fetchData() {
      if (needAgent) {
        const {data} = await fetchAgents()
        setAllAgents(data)
      }
    }

    fetchData()
  }, [])
  return agents
}

export function usePackageName() {
  const [packageName, setPackageName] = useState([])
  useEffect(() => {
    async function fetchData() {
      const {data} = await getPackageName()
      setPackageName(data)
    }

    fetchData()
  }, [])
  return packageName
}
