import { useEffect, useState } from "react";
import EditorToolbar from "../Components/EditorToolbar";
import { useAuthContext } from "../hooks/useAuthContext";
import { Navigate } from "react-router-dom";

const Draft = () => {
	const { user } = useAuthContext();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => setIsLoading(false), 2000);
	}, []);

	if (isLoading) {
		return <h1>Loading...</h1>;
	}
	if (!user && !isLoading) {
		return <Navigate to="/" replace={true} />;
	}

	return (
		<>
			<EditorToolbar />
			{user && <h1>{user.email}</h1>}
			{!user && <h1>no user</h1>}
		</>
	);
};

export default Draft;
