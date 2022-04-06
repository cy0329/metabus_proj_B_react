import { useApiAxios } from 'api/base';
import { useAuth } from 'contexts/AuthContext';
import useFieldValues from 'hooks/useFieldValues';
// import DebugStates from 'DebugStates';
import { useEffect, useMemo, useState } from 'react';
import './Assignment.css';
import '../../App.css';
import LoadingIndicator from 'LoadingIndicator';
import { useParams } from 'react-router-dom';
import DebugStates from 'DebugStates';

const INIT_FIELD_VALUES = {
  adopter_name: '',
  monthly_income: '',
  residential_type: '아파트',
  have_pet_or_not: false,
  status: '신청',
};

function AssignmentForm({ handleDidSave }) {
  const { auth } = useAuth();
  const { animalId } = useParams();
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [clickedSearch, setClickedSearch] = useState(0);

  // 사진 등록시
  const imgpreview1 = (e, fileData) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage1(reader.result);
        resolve();
        handleFieldChange(e);
      };
    });
  };

  const imgpreview2 = (e, fileData) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage2(reader.result);
        resolve();
        handleFieldChange(e);
      };
    });
  };

  const imgpreview3 = (e, fileData) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage3(reader.result);
        resolve();
        handleFieldChange(e);
      };
    });
  };

  // 유저, 동물 정보 초기값으로 입력
  INIT_FIELD_VALUES.user = auth.userID;
  INIT_FIELD_VALUES.animal = animalId;

  const [help, setHelp] = useState(false);
  const { fieldValues, handleFieldChange, setFieldValues } =
    useFieldValues(INIT_FIELD_VALUES);

  // get 요청
  const [
    { data: animal, loading: getLoading, error: getError, errorMessages },
    queryanimal,
  ] = useApiAxios(
    {
      url: `/streetanimal/api/animalnotpaging/${animalId}/`,
      method: 'GET',
    },
    { manual: true },
  );

  useEffect(() => {
    queryanimal();
  }, []);

  // TODO: filtAnimal을 가지고 QueryAnimal에서 필터링해서 하나의 상태값에 저장
  // 상태값을 버튼형식으로 표출 -> 클릭시 fieldValues에 그 동물의 pk가 들어가도록

  // 저장 api 요청
  const [
    {
      loading: saveLoading,
      error: saveError,
      errorMessages: saveErrorMessages,
    },
    saveRequest,
  ] = useApiAxios(
    {
      url: `/adopt_assignment/api/assignment/`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  // 신청 저장
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(fieldValues).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        const fileList = value;
        fileList.forEach((file) => formData.append(name, file));
      } else {
        formData.append(name, value);
      }
    });
    saveRequest({
      data: formData,
    }).then((response) => {
      const savedPost = response.data;
      // console.log(savedPost);
      if (handleDidSave) handleDidSave(savedPost);
    });
  };

  // 이름 폼에 현재 로그인한 이름 입력
  const putAuthName = (e) => {
    e.preventDefault();
    setFieldValues((prevFieldValues) => {
      return {
        ...prevFieldValues,
        adopter_name: auth.name,
      };
    });
  };

  return (
    <>
      <div className="header flex flex-wrap justify-center" id="topLoc">
        <div className="assignments_header rounded-xl shadow-md overflow-hidden md:px-20 pt-5 pb-10 my-10 lg:w-2/3 md:w-5/6 sm:w-full sm:mx-5 xs:w-full xs:mx-5">
          <blockquote className="mt-10 mb-6 xs:text-xl md:text-2xl font-semibold italic text-center text-slate-900">
            <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-blue-500 relative inline-block text-4xl font-extrabold">
              <span className="relative text-white">" 크루원 모집 "</span>
            </span>
          </blockquote>
          {getLoading && (
            <LoadingIndicator>&nbsp;&nbsp;로딩 중...</LoadingIndicator>
          )}
          {getError && (
            <>
              <p className="text-red-400">
                &nbsp;&nbsp; ! 로딩 중 에러가 발생했습니다. !
              </p>
            </>
          )}
          {getError?.response?.status === 401 && (
            <div className="text-red-400">
              조회에 실패했습니다. 입력하신 정보를 다시 확인해주세요.
            </div>
          )}

          {/* 컨테이너 끝 */}
          {/* 선택한 동물 상세정보 보여주기 */}

          <p className="text-center text-blue-900 font-bold md:text-xl  xs:text-base my-10">
            ⬇ 선택하신 동물 정보가 표시됩니다. ⬇
          </p>
          {animal && (
            <div>
              <img
                src={animal.image_url1}
                alt=""
                className="w-52 inline cursor-pointer"
                onClick={() => window.open(animal.image_url1)}
              />
              <img
                src={animal.image_url2}
                alt=""
                className="w-52 inline cursor-pointer"
                onClick={() => window.open(animal.image_url2)}
              />
              <img
                src={animal.image_url3}
                alt=""
                className="w-52 inline cursor-pointer"
                onClick={() => window.open(animal.image_url3)}
              />
              <h2 className="">공고번호 : {animal.announce_no}</h2>
              <h2 className="">
                품종 : {animal.kind_of_animal} &gt; {animal.breed}
              </h2>
              <h2 className="">털색 : {animal.color}</h2>
              <h2 className="">성별 : {animal.sex}</h2>
              <h2 className="">나이 : {animal.age}</h2>
              <h2 className="">체중 : {animal.weight} kg</h2>
              <h2 className="">중성화 여부 : {animal.neutering}</h2>
              <h2 className="">보호 상태 : {animal.protect_status}</h2>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------- */}
      {/* 신청하는 폼 */}

      <div className="header flex flex-wrap justify-center">
        <div className="assignments_header rounded-xl overflow-hidden  sm:w-full sm:mx-5 xs:w-full xs:mx-5 md:w-5/6 md:px-20 lg:w-2/3 pb-10 my-10">
          <form
            className="assignments_header sm:px-20 md:px-0 py-10"
            onSubmit={handleSubmit}
          >
            {fieldValues.animal && (
              <>
                <p className="text-center text-blue-900 font-bold mb-2 mt-3 md:text-xl xs:text-m">
                  ③ 크루원을 선택하셨으면,
                </p>
                <p className="text-center text-blue-900 font-bold mb-5 md:text-xl xs:text-m">
                  신청자님의 정보를 입력해주세요!
                </p>
              </>
            )}

            <hr />
            {/* 신청자 이름 */}
            <div className="my-5">
              <span className="ml-5  mb-2 after:content-['*'] after:ml-0.5 after:text-red-500 block tracking-wide text-gray-700 xl:text-xl lg:text-xl md:text-base sm:text-base xs:text-base font-bold">
                신청자 이름
              </span>
              <input
                type="text"
                name="adopter_name"
                value={fieldValues.adopter_name}
                onChange={handleFieldChange}
                placeholder="이름을 입력해주세요."
                className="mx-5 rounded-md xl:text-base lg:text-base md:text-base sm:text-s xs:text-s bg-gray-100 focus:bg-white focus:border-gray-400 p-3 xs:w-1/2"
              />

              <button
                onClick={(e) => putAuthName(e)}
                className="border-blue-400 bg-blue-400 hover:border-blue-200 hover:bg-blue-200 xl:text-xl lg:text-xl md:text-base sm:text-base xs:text-base  text-white px-1 py-2 rounded "
                readOnly
              >
                &nbsp;회원 정보와 동일&nbsp;
              </button>
              {saveErrorMessages.adopter_name?.map((message, index) => (
                <p
                  key={index}
                  className="ml-10 xs:text-sm md:text-base text-red-400"
                >
                  ! 이름을 입력해주세요.
                </p>
              ))}
            </div>
            <hr className="bg-gray-100" />
            {/* 신청자 월 수입 */}
            <div className="my-5 w-full">
              <span className="mx-5 after:content-['*'] after:ml-0.5 after:text-red-500 block tracking-wide text-gray-700 xs:text-base sm:text-lg md:text-2xl font-bold mb-2">
                월 수입
                <button onClick={() => setHelp(!help)} className="inline">
                  <img src="/outline_help.png" alt="help"></img>
                </button>
                {help && (
                  <div className="mt-1 justify-center">
                    <p className="bg-yellow-100 text-red-300">* 알림 *</p>
                    <p className="bg-yellow-100 text-base text-blue-300">
                      반려동물도 정기적으로 건강 관리가 필요하며, 그에 따른
                      비용을 고려해야 합니다.
                    </p>
                    <p className="bg-yellow-100 text-gray-400">
                      ( 월 수입을 10,000원 단위로 입력해주세요.)
                    </p>
                  </div>
                )}
              </span>
              <input
                type="number"
                name="monthly_income"
                value={fieldValues.monthly_income}
                onChange={handleFieldChange}
                className="mx-5 rounded-md xl:text-base lg:text-base md:text-base sm:text-s xs:text-s bg-gray-100 focus:bg-white focus:border-gray-400 p-3 xs:w-1/2"
              />
              <span className="xs:ml-0 xs:mt-3 sm:ml-3 sm:mt-0 md:text-xl xs:text-base">
                만 (원)
              </span>
              {saveErrorMessages.monthly_income?.map((message, index) => (
                <p
                  key={index}
                  className="ml-10 xs:text-sm md:text-base text-red-400"
                >
                  ! 월 수입을 입력해주세요.
                </p>
              ))}
            </div>

            <hr className="bg-gray-100" />

            {/* 주거형태 */}
            <div className="my-5 w-full">
              <span className="mx-5 after:content-['*'] after:ml-0.5 after:text-red-500 block tracking-wide text-gray-700 xs:text-base sm:text-lg md:text-2xl font-bold mb-2">
                주거 형태
              </span>
              <div className="relative">
                <select
                  name="residential_type"
                  value={fieldValues.residential_type}
                  onChange={handleFieldChange}
                  className="mx-5 appearance-none rounded-md bg-gray-100 focus:bg-white focus:border-gray-400 p-3 xs:w-2/3 xs:text-sm sm:w-1/2 sm:text-lg lg:w-2/3 xl:w-3/4"
                  defaultValue="아파트"
                >
                  <option value="아파트">아파트</option>
                  <option value="빌라">빌라</option>
                  <option value="주택">주택</option>
                  <option value="원룸">원룸</option>
                  <option value="오피스텔">오피스텔</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 xs:right-1/3 sm:right-1/2 lg:right-1/3 xl:right-1/4 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <hr className="bg-gray-100" />

            {/* 반려동물 유무 */}
            <div className="my-5 w-full">
              <span className="mx-5 block tracking-wide text-gray-700 xs:text-base sm:text-lg md:text-2xl font-bold mb-2">
                반려동물 키움 여부
                <input
                  type="checkbox"
                  onChange={handleFieldChange}
                  name="have_pet_or_not"
                  checked={fieldValues.have_pet_or_not}
                  className="ml-5"
                />
              </span>
              <p className="mx-5 xs:text-sm sm:text-base md:text-lg text-gray-400">
                확인용 절차입니다.
              </p>
            </div>
            <hr className="bg-gray-100" />

            {/* 거주지 사진 */}
            <div className="my-5 w-full">
              <span className="mx-5 after:content-['*'] after:ml-0.5 after:text-red-500 block tracking-wide text-gray-700 xs:text-base sm:text-lg md:text-2xl font-bold mb-2">
                거주지 사진
              </span>
              <p className="mx-5 text-base mb-1 md:text-m xs:text-sm text-gray-400">
                ( 신청자의 현 거주지 사진 업로드가 필요합니다! )
              </p>

              <div className="mx-5 bg-white py-5">
                {/* 거주지 파일 첨부 인풋박스 ul태그 시작 부분*/}
                <ul>
                  {/* 거주지 파일 input 박스 1  */}
                  <li className="mx-5 flex justify-between items-center text-base px-4 py-3 border-2 rounded-md xs:mr-5 sm:mr-0">
                    <input
                      type="file"
                      name="picture_of_residence1"
                      accept=".png, .jpg, .jpeg, .jfif"
                      onChange={(e) => {
                        imgpreview1(e, e.target.files[0]);
                      }}
                    />
                    {image1 && (
                      <div>
                        <img src={image1} alt="" className="h-44" />
                      </div>
                    )}
                  </li>
                  {saveErrorMessages.picture_of_residence1?.map(
                    (message, index) => (
                      <p
                        key={index}
                        className="mb-3 xs:text-sm md:text-base text-red-400 ml-3"
                      >
                        {message}
                      </p>
                    ),
                  )}

                  {/* 거주지 파일 input 박스 2 */}
                  <li className="mx-5 flex justify-between items-center text-base px-4 py-3 border-2 rounded-md xs:mr-5 sm:mr-0">
                    <input
                      type="file"
                      name="picture_of_residence2"
                      accept=".png, .jpg, .jpeg, .jfif"
                      onChange={(e) => {
                        imgpreview2(e, e.target.files[0]);
                      }}
                    />
                    {image2 && (
                      <div>
                        <img src={image2} alt="" className="h-44" />
                      </div>
                    )}
                  </li>
                  {saveErrorMessages.picture_of_residence2?.map(
                    (message, index) => (
                      <p
                        key={index}
                        className="mb-3 xs:text-sm md:text-base text-red-400 ml-3"
                      >
                        {message}
                      </p>
                    ),
                  )}

                  {/* 거주지 파일 input 박스 3 */}
                  <li className="mx-5 flex justify-between items-center text-base px-4 py-3 border-2 rounded-md xs:mr-5 sm:mr-0">
                    <input
                      type="file"
                      name="picture_of_residence3"
                      accept=".png, .jpg, .jpeg, .jfif"
                      onChange={(e) => {
                        imgpreview3(e, e.target.files[0]);
                      }}
                    />
                    {image3 && (
                      <div>
                        <img src={image3} alt="" className="h-44" />
                      </div>
                    )}
                  </li>
                  {saveErrorMessages.picture_of_residence3?.map(
                    (message, index) => (
                      <p
                        key={index}
                        className="mb-3 xs:text-sm md:text-base text-red-400 ml-3"
                      >
                        {message}
                      </p>
                    ),
                  )}
                </ul>
              </div>
            </div>
            <hr className="bg-gray-100" />

            {/* 만남 희망 날짜 */}
            <div className="my-5 w-full">
              <div className="relative">
                <span className="mx-5 mt-5 after:content-['*'] after:ml-0.5 after:text-red-500 block tracking-wide text-gray-700 xs:text-base sm:text-lg md:text-2xl font-bold mb-2">
                  만남 희망 날짜
                </span>
                <p className="xs:text-sm md:text-base mx-5 text-gray-400 mb-2 mt-1">
                  센터 방문 날짜를 선택해주세요!
                </p>
                <input
                  type="date"
                  name="date_to_meet"
                  onChange={handleFieldChange}
                  className="mx-5 appearance-none rounded-md bg-gray-100 focus:bg-white focus:border-gray-400 p-3 xs:w-2/3 xs:text-sm sm:w-1/2 sm:text-lg md:w-2/3 xl:w-3/4"
                />
                {saveErrorMessages.date_to_meet?.map((message, index) => (
                  <p key={index} className="ml-10 text-base text-red-400">
                    ! 날짜를 다시 선택해주세요.
                  </p>
                ))}
              </div>
            </div>

            {/* 신청버튼 */}
            <div className="flex justify-center my-5">
              <button
                className="hover:scale-110 duration-500 sm:w-32 xs:w-24"
                readOnly
              >
                <img src="/assignicon2.png" alt="button"></img>
              </button>
            </div>
            <div className="flex justify-center xs:text-sm">
              {saveLoading && <LoadingIndicator>저장 중...</LoadingIndicator>}
              {saveError &&
                `저장 중 에러가 발생했습니다. 신청 양식을 확인해주세요.`}
            </div>
          </form>
        </div>
      </div>

      <DebugStates fieldValues={fieldValues} />
    </>
  );
}

export default AssignmentForm;
