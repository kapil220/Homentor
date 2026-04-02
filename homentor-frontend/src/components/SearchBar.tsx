import React from 'react'

function SearchBar({setSearchTerm, searchTerm}) {
  return (
    
          <div className="relative lg:hidden flex flex-wrap items-center">
              {/* <!--Search icon--> */}
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" className="search-click z-40" name="" placeholder="search here..." />
              <span
                  className="absolute input-group-text flex items-center whitespace-nowrap rounded px-4 py-0 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                  id="basic-addon2">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4">
                      <path
                          fillRule="evenodd"
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                          clipRule="evenodd" />
                  </svg>
              </span>
          </div>
    

  )
}

export default SearchBar