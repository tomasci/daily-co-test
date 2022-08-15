import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import TestPage from "@/pages/TestPage"

function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path={"/"}
					element={<Navigate to={"/en"} replace={true} />}
				/>
				<Route
					path={"session/:session_id/user/:email/*"}
					element={<TestPage />}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default Router
