export const CardLoading = () => {
	return (
		<>
			<div className=" mb-4 rounded shadow-md w-full animate-pulse bg-gray-300">
				<div className="flex flex-col md:flex-row p-4 space-y-4">
					<div className="md:w-2/3 pr-4">
						<div className="flex space-x-4">
							<div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-100"></div>
							<div className="flex-1 py-2 space-y-4">
								<div className="md:w-52 h-3 rounded bg-gray-100"></div>
								<div className="w-32 h-3 rounded bg-gray-100"></div>
							</div>
						</div>
						<div className="py-4 space-y-4">
							<div className="w-full h-4 rounded bg-gray-100"></div>
							<div className="w-full h-4 rounded bg-gray-100"></div>
							<div className="w-3/4 h-4 rounded bg-gray-100 hidden md:block"></div>
						</div>
					</div>
					<div className="bg-gray-100 rounded-xl h-48 md:w-1/3"></div>
				</div>
			</div>
		</>
	);
};
