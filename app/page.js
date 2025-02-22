
'use client'

import { useState } from 'react'


export default function Home() {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState('')
  const [processedData, setProcessedData] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState([])

  const validateAndProcessJSON = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const parsedJSON = JSON.parse(jsonInput)
      if (!parsedJSON.data || !Array.isArray(parsedJSON.data)) {
        throw new Error('Invalid JSON format. Expected {"data": [...]}')
      }

      const response = await fetch('https://testbfhl-rtki.vercel.app/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonInput,
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      setProcessedData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format')
    }
  }

  const handleFilterChange = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const filterOptions = [
    { id: 'alphabets', label: 'Alphabets' },
    { id: 'numbers', label: 'Numbers' },
    { id: 'highest_alphabet', label: 'Highest alphabet' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl text-black">
      <form onSubmit={validateAndProcessJSON} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            API Input
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='{"data": ["A","C","z"]}'
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>

      {processedData && (
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Multi Filter
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleFilterChange(option.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                    selectedFilters.includes(option.id)
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                  {selectedFilters.includes(option.id) && (
                    <span className="text-gray-500 hover:text-gray-700">×</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-white">
            <h2 className="text-lg font-semibold">Filtered Response</h2>
            <div className="space-y-2">
              {selectedFilters.includes('numbers') && processedData.numbers && (
                <p className="text-white">
                  Numbers: {processedData.numbers.join(',')}
                </p>
              )}
              {selectedFilters.includes('alphabets') && processedData.alphabets && (
                <p className="text-white">
                  Alphabets: {processedData.alphabets.join(',')}
                </p>
              )}
              {selectedFilters.includes('highest_alphabet') && processedData.highest_alphabet && (
                <p className="text-white">
                  Highest Alphabet: {processedData.highest_alphabet}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}