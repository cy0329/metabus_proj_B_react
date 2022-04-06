import { useApiAxios } from 'api/base';
import { useAuth } from 'contexts/AuthContext';
import produce from 'immer';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignStatus from './AssignStatus';
import '../../App.css';
import './AssignManagement.css';
import LoadingIndicator from 'LoadingIndicator';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import '../review/SlideStyle.css';

function AssignDetail({ assignId }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  // get 요청
  const [{ data: assignData }, refetch] = useApiAxios(
    {
      url: `/adopt_assignment/api/assignment/${assignId}/`,
      method: 'GET',
    },
    { manual: true },
  );

  useEffect(() => {
    refetch();
  }, []);

  // delete 요청
  const [{ loading: deleteLoading, error: deleteError }, deleteAssign] =
    useApiAxios(
      {
        url: `/adopt_assignment/api/assignment/${assignId}/`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      },
      { manual: true },
    );

  // patch 요청
  const [{ loading, error }, changeAPS] = useApiAxios(
    {
      url: `/streetanimal/api/animal/${assignData?.animal.animal_no}/`,
      method: 'PATCH',
      data: { protection_status: '입양 대기' },
    },
    { manual: true },
  );

  const [
    { loading: changeStatusLoading, error: changeStatusError },
    patchAnimalStatus,
  ] = useApiAxios(
    {
      url: `/streetanimal/api/animal/${assignData?.animal.animal_no}/`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  const handleDelete = () => {
    if (window.confirm('정말 삭제 할까요?')) {
      deleteAssign().then(() => {
        changeAPS().then(() => {
          navigate('/admin/assignmanage/');
          window.location.reload();
        });
      });
    }
  };

  // 스크롤 기능
  const [topLocation, setTopLocation] = useState(0);
  // console.log('topLocation: ', topLocation);
  useEffect(() => {
    setTopLocation(document.querySelector('#topLoc').offsetTop);
  }, [assignData]);

  const gotoTop = () => {
    // 클릭하면 스크롤이 위로 올라가는 함수
    window.scrollTo({
      top: topLocation,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    gotoTop();
  }, [assignData]);

  //-------------

  return (
    <>
      <div className="header flex flex-wrap justify-center" id="topLoc">
        <div className="mx-5 assignmanagement_header rounded-xl  overflow-hidden md:px-20 sm:px-0 pt-5 pb-10 my-10 lg:w-2/3 md:w-5/6 sm:w-full xs:w-full">
          <blockquote class="mt-5 text-6xl font-semibold italic text-center text-slate-900">
            <span class="mt-3 mb-10 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-blue-900 relative inline-block xs:text-2xl sm:text-4xl md:text-6xl">
              <span class="relative text-white">" 신청자 정보 "</span>
            </span>
          </blockquote>
          {/* 로딩 에러 */}
          {loading && <LoadingIndicator>로딩 중 ...</LoadingIndicator>}
          {error && (
            <>
              <p className="text-red-400">
                &nbsp;&nbsp; ! 로딩 중 에러가 발생했습니다. !
              </p>
            </>
          )}
          {error?.response?.status === 401 && (
            <div className="text-red-400">
              조회에 실패했습니다. 입력하신 정보를 다시 확인해주세요.
            </div>
          )}

          <div className="my-5 overflow-hidden">
            <table className="mb-5 mr-5 mt-6 border text-center min-w-full divide-y divide-gray-200">
              <tr className="sm:w-full">
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  신청 번호
                </th>
                <td>{assignData?.assignment_no}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  신청일
                </th>
                <td>{assignData?.created_at}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  신청자 이름
                </th>
                <td>{assignData?.adopter_name}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  회원명
                </th>
                <td>{assignData?.user.name}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  회원 연락처
                </th>
                <td>{assignData?.user.phone_number}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  회원 e-mail
                </th>
                <td>{assignData?.user.email}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  월 수입
                </th>
                <td>{assignData?.monthly_income}만</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  주거 형태
                </th>
                <td>{assignData?.residential_type}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  애완동물 유무
                </th>
                <td>{assignData?.have_pet_or_not ? '있음' : '없음'}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  만남 희망일
                </th>
                <td>{assignData?.date_to_meet}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  진행 상태
                </th>
                <td
                  onClick={() => {
                    auth.is_staff && setClicked(!clicked);
                  }}
                >
                  {assignData?.status}
                  {auth.is_staff && <span>(수정하려면 클릭)</span>}
                </td>
              </tr>
            </table>
            {clicked && assignData && (
              <div className="flex justify-center">
                <AssignStatus
                  assignId={assignId}
                  assignData={assignData}
                  handleDidSave={(savedPost) => {
                    savedPost && window.location.reload();
                    savedPost && setClicked(0);
                    if (savedPost?.status === '입양 완료') {
                      patchAnimalStatus({
                        data: { protection_status: '입양 완료!' },
                      });
                    } else if (savedPost?.status === '거절') {
                      patchAnimalStatus({
                        data: { protection_status: '입양 대기' },
                      });
                    } else {
                      patchAnimalStatus({
                        data: { protection_status: '입양 매칭 중' },
                      });
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* 거주지 사진 부분 */}
          <div className="flex justify-center content-center">
            <div className=" overflow-hidden">
              <h2>거주지 사진</h2>
              <div className="content-center overflow-hidden">
                {assignData && (
                  <>
                    {assignData.picture_of_residence3 &&
                    assignData.picture_of_residence2 &&
                    assignData.picture_of_residence1 ? (
                      <AwesomeSlider
                        className="Container"
                        mobileTouch={true}
                        organicArrows={true}
                        bullets={false}
                      >
                        <span>
                          {assignData.picture_of_residence1 && (
                            <img
                              src={assignData.picture_of_residence1}
                              alt="거주지 이미지"
                              className="cursor-pointer my-auto h-full w-full"
                              onClick={() =>
                                window.open(assignData?.picture_of_residence1)
                              }
                            />
                          )}
                        </span>
                        <span>
                          {assignData.picture_of_residence2 && (
                            <img
                              src={assignData.picture_of_residence2}
                              alt="거주지 이미지"
                              className="cursor-pointer my-auto h-full w-full"
                              onClick={() =>
                                window.open(assignData?.picture_of_residence1)
                              }
                            />
                          )}
                        </span>
                        <span>
                          {assignData.picture_of_residence3 && (
                            <img
                              src={assignData.picture_of_residence3}
                              alt="거주지 이미지"
                              className="cursor-pointer my-auto h-full w-full"
                              onClick={() =>
                                window.open(assignData?.picture_of_residence1)
                              }
                            />
                          )}
                        </span>
                      </AwesomeSlider>
                    ) : (
                      <>
                        {assignData.picture_of_residence1 &&
                        assignData.picture_of_residence2 ? (
                          <AwesomeSlider
                            className="Container"
                            mobileTouch={true}
                            organicArrows={true}
                            bullets={false}
                          >
                            <span>
                              {assignData.picture_of_residence1 && (
                                <img
                                  src={assignData.picture_of_residence1}
                                  alt="거주지 이미지"
                                  className="cursor-pointer my-auto h-full w-full"
                                  onClick={() =>
                                    window.open(
                                      assignData?.picture_of_residence1,
                                    )
                                  }
                                />
                              )}
                            </span>
                            <span>
                              {assignData.picture_of_residence2 && (
                                <img
                                  src={assignData.picture_of_residence2}
                                  alt="거주지이미지"
                                  className="cursor-pointer my-auto h-full w-full"
                                  onClick={() =>
                                    window.open(
                                      assignData?.picture_of_residence1,
                                    )
                                  }
                                />
                              )}
                            </span>
                          </AwesomeSlider>
                        ) : (
                          <>
                            {assignData.picture_of_residence1 && (
                              <span>
                                {assignData.picture_of_residence1 && (
                                  <img
                                    src={assignData.picture_of_residence1}
                                    alt="거주지 이미지"
                                    className="cursor-pointer my-auto h-full w-full"
                                    onClick={() =>
                                      window.open(
                                        assignData?.picture_of_residence1,
                                      )
                                    }
                                  />
                                )}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="mx-5 bg-white rounded-xl shadow-md overflow-hidden lg:w-2/3 md:w-5/6 sm:w-full xs:w-full">
          <div className="flex justify-center py-6 mb-3">
            <h2>
              💕입양 {assignData?.status === '입양 완료' ? '완료!' : '신청 중'}
              💕
            </h2>
          </div>
        </div>
      </div>

      <div className="header flex flex-wrap justify-center">
        <div className="mx-5 assignmanagement_header rounded-xl md:px-20 sm:px-0 pt-5 pb-10 my-10 lg:w-2/3 md:w-5/6 sm:w-full xs:w-full">
          {/* <div className=" pt-6 mb-3"> */}
          <blockquote className="mt-5 text-6xl font-semibold italic text-center text-slate-900">
            <span className="mt-3 mb-10 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-red-400 relative inline-block xs:text-2xl sm:text-4xl md:text-6xl">
              <span className="relative text-white">" 동물 정보 "</span>
            </span>
          </blockquote>
          {auth.is_staff && (
            <div
              className="flex justify-center"
              onClick={() =>
                navigate(`/admin/animal/${assignData?.animal.announce_no}/`)
              }
            >
              <button className="bg-red-400 p-2 rounded-lg text-white">
                동물 정보로 이동하기
              </button>
            </div>
          )}
          <div className="my-5 overflow-hidden">
            <table className="mb-5 mr-5 mt-6 border text-center min-w-full divide-y divide-gray-200">
              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  공고번호
                </th>
                <td>{assignData?.animal.announce_no}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  품종
                </th>
                <td>
                  {assignData?.animal.kind_of_animal} &gt;{' '}
                  {assignData?.animal.breed}
                </td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  성별
                </th>
                <td>{assignData?.animal.sex}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  나이
                </th>
                <td>{assignData?.animal.age}세</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  무게
                </th>
                <td>{assignData?.animal.weight}kg</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  특징
                </th>
                <td>{assignData?.animal.info}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  관할 기관
                </th>
                <td>{assignData?.animal.competent_organization}</td>
              </tr>

              <tr>
                <th className="border border-slate-200 bg-gray-50 px-3 py-3 text-center xs:text-base sm:text-xl font-bold text-gray-500 tracking-wider">
                  보호 상태
                </th>
                <td>{assignData?.animal.protect_status}</td>
              </tr>
            </table>
          </div>
          {/* 동물 사진 부분  */}
          <div className="flex justify-center content-center">
            <div className=" overflow-hidden">
              <h2>거주지 사진</h2>
              <div className="content-center overflow-hidden">
                {assignData && (
                  <>
                    {assignData.animal.image_url3 &&
                    assignData.animal.image_url2 &&
                    assignData.animal.image_url1 ? (
                      <AwesomeSlider
                        className="Container"
                        mobileTouch={true}
                        organicArrows={true}
                        bullets={false}
                      >
                        <span>
                          {assignData.animal.image_url1 && (
                            <img
                              src={assignData.animal.image_url1}
                              alt="동물 이미지"
                              className="h-full w-full"
                            />
                          )}
                        </span>
                        <span>
                          {assignData.animal.image_url2 && (
                            <img
                              src={assignData.animal.image_url2}
                              alt="동물 이미지"
                              className="h-full w-full"
                            />
                          )}
                        </span>
                        <span>
                          {assignData.animal.image_url3 && (
                            <img
                              src={assignData.animal.image_url3}
                              alt="동물 이미지"
                              className="h-full w-full"
                            />
                          )}
                        </span>
                      </AwesomeSlider>
                    ) : (
                      <>
                        {assignData.animal.image_url1 &&
                        assignData.animal.image_url2 ? (
                          <AwesomeSlider
                            className="Container"
                            mobileTouch={true}
                            organicArrows={true}
                            bullets={false}
                          >
                            <span>
                              {assignData.animal.image_url1 && (
                                <img
                                  src={assignData.animal.image_url1}
                                  alt="동물 이미지"
                                  className="h-full w-full"
                                />
                              )}
                            </span>
                            <span>
                              {assignData.animal.image_url2 && (
                                <img
                                  src={assignData.animal.image_url2}
                                  alt="동물 이미지"
                                  className="h-full w-full"
                                />
                              )}
                            </span>
                          </AwesomeSlider>
                        ) : (
                          <>
                            {assignData.animal.image_url1 && (
                              <span>
                                {assignData.animal.image_url1 && (
                                  <img
                                    src={assignData.animal.image_url1}
                                    alt="동물 이미지"
                                    className="h-full w-full"
                                  />
                                )}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="my-5 text-right mr-5">
            {auth.is_staff && (
              <button
                onClick={() => handleDelete()}
                className="ml-3 flex-shrink-0 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded"
              >
                삭제
              </button>
            )}

            <button
              onClick={() => {
                auth.is_staff
                  ? navigate(`/admin/assignmanage/`)
                  : navigate(`/mypage/assigninfo/`);
              }}
              className="ml-3 flex-shrink-0 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded"
            >
              목록
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default AssignDetail;
