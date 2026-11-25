import React from "react";
import Status from "../components/Status";

const NotFound = () => (
  <Status
    title="페이지를 찾을 수 없어요"
    message="주소가 잘못되었거나 삭제된 페이지입니다."
    homeLink
  />
);

export default NotFound;
