import { useParams } from "react-router-dom";

import Loader from "@/components/shared/Loader";

import PostForm from "@/forms/PostForm";

import { useGetPostById } from "@/lib/react-query/queriesAndMutations";

const EditPost = () => {
	// get id from url parameters
    const { id } = useParams();

	// object de-structuring after fetching posts depending on post ID
    const { data: post, isLoading } = useGetPostById(id || '');

    if (isLoading)
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        );

    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="flex-start gap-3 justify-start w-full max-w-5xl">
                    <img
                        src="/assets/icons/edit.svg"
                        width={36}
                        height={36}
                        alt="edit"
                        className="invert-white"
                    />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
                </div>

				{/* Post Update  */}
                {isLoading ? <Loader /> : <PostForm action="Update" post={post} />}
            </div>
        </div>
    );
};

export default EditPost;
