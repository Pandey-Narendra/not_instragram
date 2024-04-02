import GridPostList from "@/components/shared/GridPostList";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';

const Explore = () => {
	const {ref, inView } = useInView();
	const [searchValue, setSearchValue] = useState('');

	// to optimise the search on every key stock 
	const DebouncedValue = useDebounce(searchValue, 500);

	const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
	const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(DebouncedValue);

	useEffect(() => {
		if(inView && !searchValue) fetchNextPage();
	},[inView, searchValue])

	// const posts = [];
	if(!posts) return;

	const shouldShowSearchResults = searchValue !== '';
	const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((items) => items.documents.length === 0); 

	return (
		<div className="explore-container">
			<div className="explore-inner_container">
				<h2 className="h3-bold md:h2-bold w-full">Search</h2>
				<div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
					<img 
						src="/assets/icons/search.svg" 
						alt="search"
						width={24}
						height={24} 
					/>

					<Input 
						type="text" 
						placeholder="Search"
						className="explore-search"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex-between w-full max-w-5xl mt-16 mb-7">
				<h3 className="body-bold md:h3-bold">Popular Today</h3>
				<div className="flex-center gap-3 bg-dark-3 rounded-xl px-4">
					<p className="small-medium md:base-medium text-light-2">All</p>

					<img 
						src="/assets/icons/filter.svg"
						width={20}
						height={20} 
						alt="filter" 
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-9 w-full max-w-5xl">
				{shouldShowSearchResults ? (
				
					<SearchResults isSearchFetching = {isSearchFetching} searchedPosts = {searchedPosts}  />
				
				): shouldShowPosts ? (
					
					<p className="text-light-4 mt-10 text-center w-full">End of posts</p>
				
				): posts.pages.map( (items,index) => (

					<GridPostList key={`page-{$index}`} posts={items.documents} />

				))}
			</div>

			{hasNextPage && !searchValue && (
				<div ref={ref} className="mt-10">
					<Loader />
				</div>
			)}
		</div>
	)
}

export default Explore