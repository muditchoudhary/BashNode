import { useReducer, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

const LOAD_DELAY_MS = 500;
const INTERSECTION_THRESHOLD = 5;

const reducer = (state, action) => {
	switch (action.type) {
		case "set": {
			return {
				...state,
				...action.payload,
			};
		}
		case "onGrabData": {
			return {
				...state,
				loading: false,
				data: [...state.data, ...action.payload.data],
				currentPage: action.payload.currentPage + 1,
			};
		}
		default:
			return state;
	}
};
export const useLazyLoad = ({ triggerRef, onGrabData, options }) => {
	const [state, dispatch] = useReducer(reducer, {
		loading: false,
		currentPage: 1,
		totalPages: 1,
		data: [],
	});

	const _handleEntry = async (entry) => {
		const boundingRect = entry.boundingClientRect;
		const intersectionRect = entry.intersectionRect;

		if (
			!state.loading &&
			entry.isIntersecting &&
			intersectionRect.bottom - boundingRect.bottom <=
				INTERSECTION_THRESHOLD
		) {
			dispatch({ type: "set", payload: { loading: true } });
			const data = await onGrabData(state.currentPage);
			dispatch({
				type: "set",
				payload: { totalPages: data["totalPages"] },
			});
			dispatch({
				type: "onGrabData",
				payload: { data: data["publishedBlogs"], currentPage: Number(data["currentPage"]) },
			});
		}
	};

	const handleEntry = debounce(_handleEntry, LOAD_DELAY_MS);

	const onIntersect = useCallback(
		(entries) => {
			handleEntry(entries[0]);
		},
		[handleEntry]
	);

	useEffect(() => {
		if (triggerRef.current) {
			const container = triggerRef.current;
			const observer = new IntersectionObserver(onIntersect, options);

			observer.observe(container);

			if (state.currentPage > state.totalPages) {
				observer.disconnect();
				container.classList.add("hidden");
			}

			return () => {
				observer.disconnect();
			};
		}
	}, [triggerRef, onIntersect, options, state.currentPage, state.totalPages]);

	return state;
};
