import { useNavigate } from "react-router-dom"
import SearchBar from "../components/SearchBar"
import { useState } from "react"
import FAQ from "@/components/FAQ"

function Home() {

  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState<string>("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchInput) {
      navigate(`/auth?creatNew=${searchInput}`)
    }
  }

  return (
    <div className="container flex flex-col gap-10 py-20" style={{minHeight:'calc(100vh - 5rem)'}}>
      <h1 className="text-5xl font-extrabold text-center">Short your url</h1>
      <form onSubmit={(e) => handleSubmit(e)} >
        <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} />
      </form>
      <FAQ />
    </div>
  )
}

export default Home
