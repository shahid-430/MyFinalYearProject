import React, { Children, createContext } from 'react'

//here we craete authContext 
 export const authDataContext = createContext()

function AuthContext({children}) {
    let serverUrl= "http://localhost:8000"

let value ={ 
    serverUrl

}



  return (
    <div>
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>

    </div>
  )
}

export default AuthContext