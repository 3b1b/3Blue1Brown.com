const MailList = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname !== "localhost") {
      return (
        <iframe
          title="Subscribe to Mailing List"
          src="https://3blue1brown.substack.com/embed"
          width="480"
          height="180"
        />
      );
    }
  }
  return <></>;
};

export default MailList;
