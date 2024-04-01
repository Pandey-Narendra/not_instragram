import { Models } from "appwrite";

import Loader from "@/components/shared/Loader";

import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";

import PostCard from "@/components/shared/PostCard";

const Home = () => {
    const { data: posts, isLoading: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();

    if (isErrorPosts) {
        return (
            <div className="flex flex-1">
                <div className="home-container">
                    <p className="body-medium text-light-1">Something bad happened</p>
                </div>
                <div className="home-creators">
                    <p className="body-medium text-light-1">Something bad happened</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2bold text-left w-full">
                        Home  Feed
                    </h2>

                    {
                        isPostLoading && !posts ? (
                            <Loader />

                        ): (
                            <ul className="grid 2xl:grid-cols-2 gap-6">
                                {
                                    posts?.documents.map((post: Models.Document, index) => (
                                        <li key={index} className="flex justify-center w-full">
                                            <PostCard post={post} />
                                        </li>
                                    )) 
                                }
                            </ul>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Home