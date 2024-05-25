import React, { useContext } from 'react';
import { GetCohortsResponse } from '../../../shared/models/responses/getCohortsResponse';
import { CohortsContext } from '@/app/contexts/CohortsContext';

const Cohorts = () => {
  const { cohorts } = useContext(CohortsContext);

  return (
    <div id="gantt-grid-container__cohorts">
      <div className="gantt-cohort-row"></div>
      <div className="gantt-cohort-row"></div>
      {cohorts?.map((cohort: GetCohortsResponse, i: number) => (
        <div key={`${i}-${cohort?.id}-${cohort.name}`} className="gantt-cohort-row">
          <h4>{cohort.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default Cohorts;
