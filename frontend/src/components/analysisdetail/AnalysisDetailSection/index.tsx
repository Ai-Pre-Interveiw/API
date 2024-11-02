import { BASE_URL } from '@utils/requestMethods'
import { useState } from 'react';
import * as a from '@components/analysisdetail/AnalysisDetailSection/AnalysisDetailSection.styled'
import { Navigate, useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import { useRecoilValue } from 'recoil';
import { userState } from '@/stores/user';

const index = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate()
  return (
    <a.Container>
      
    </a.Container>
  )
}

export default index