'use client'
import '../styles/globals.css'
import { createContext, useContext } from 'react'
import useFirebaseAuth from './context'

const authUserContext = createContext({
	authUser: null,
	loading: true
})

export const useAuth = () => useContext(authUserContext)

export default function RootLayout({ children }) {
	const auth = useFirebaseAuth()

	return (
		<authUserContext.Provider value={auth}>
			<html lang="en">
				<body>{children}</body>
			</html>
		</authUserContext.Provider>
	)
}