const handleError = (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return (message);
  };

export default handleError;