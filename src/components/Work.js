import React from 'react';

const Work = ({ match }) => (
  <h3>Message with ID {match.params.workId}</h3>
);

export default Work;