import { useApiAxios } from 'api/base';
import { useAuth } from 'contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './LostPetBoard.css';
import '../../App.css';
import LoadingIndicator from 'LoadingIndicator';

function LostPetBoardDetail({ lostpetboardId }) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [{ data: lostpetboard, loading, error }, refetch] = useApiAxios(
    `/lost_pet_board/api/board/${lostpetboardId}/`,
    { manual: true },
  );

  const [{ loading: deleteLoading, error: deleteError }, deleteLostPetboard] =
    useApiAxios(
      {
        url: `/lost_pet_board/api/board/${lostpetboardId}/`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      },
      { manual: true },
    );

  const handleDelete = () => {
    if (window.confirm('정말 삭제 할까요?')) {
      deleteLostPetboard().then(() => {
        navigate('/lostpetboard/');
        window.location.reload();
      });
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <div className="header flex flex-wrap justify-center">
        <div className="mx-5 review_header rounded-xl shadow-md overflow-hidden pt-5 pb-10 my-10  lg:w-2/3 md:w-5/6 sm:w-full xs:w-full">
          <blockquote className="mt-3 mb-10 font-semibold italic text-center text-slate-900">
            <span className="mt-7 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-purple-400 relative inline-block  xs:text-2xl sm:text-4xl lg:text-6xl ">
              <span className="relative text-white">" 우리 아이 찾아요 "</span>
            </span>
          </blockquote>

          {/* 로딩 에러 */}
          {loading && (
            <>
              <p className="text-blue-400">&nbsp;&nbsp;로딩 중...</p>
            </>
          )}
          {error && (
            <>
              <p className="text-red-400">
                &nbsp;&nbsp; ! 로딩 중 에러가 발생했습니다. !
              </p>
            </>
          )}
          <div className="flex justify-center">
            <div className="px-4 py-5 xs:w-full sm:w-2/3">
              {lostpetboard && (
                <>
                  <h1
                    className={
                      lostpetboard.title.length > 20
                        ? 'text-xl leading-6 font-bold text-gray-900 tracking-wide'
                        : 'text-3xl leading-6 font-bold text-gray-900 tracking-wide'
                    }
                  >
                    {lostpetboard.title}
                  </h1>
                  <hr className="mt-3 mb-3" />

                  <div className="flex justify-center">
                    {lostpetboard.board_image && (
                      <img src={lostpetboard.board_image?.[0]?.image} alt="" />
                    )}
                  </div>

                  <ul>
                    <li>유실장소:{lostpetboard.find_location}</li>
                    <li>동물이름:{lostpetboard.pet_name}</li>
                    <li>동물종류:{lostpetboard.animal_type}</li>
                    <li>
                      품종:{' '}
                      {lostpetboard.animal_type === '강아지'
                        ? lostpetboard.dog_breed
                        : lostpetboard.cat_breed}
                    </li>
                    <li>사이즈:{lostpetboard.size}</li>
                    <li>인식표:{lostpetboard.animal_tag}</li>
                  </ul>

                  <div className="my-5 text-right">
                    <button
                      className="ml-3 flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded"
                      onClick={() => handleDelete()}
                    >
                      삭제
                    </button>
                    <Link
                      className="ml-3 flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded"
                      to={`/lostpetboard/${lostpetboardId}/edit/`}
                    >
                      수정
                    </Link>
                    <Link
                      className="ml-3 flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded"
                      to="/lostpetboard/"
                    >
                      목록
                    </Link>

                    {deleteLoading && (
                      <LoadingIndicator>삭제 중 ...</LoadingIndicator>
                    )}
                    {deleteError && `삭제 요청 중 에러가 발생했습니다.`}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LostPetBoardDetail;
