import React, { useState } from "react";
import moment from "moment";
import { capitalizeFirstLetter } from "../../config/utils";
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const MeetingsList = ({ meetings }) => {
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState([]);
  const appURL = process.env.REACT_APP_URL;
  const apiURL = process.env.REACT_APP_API_URL;

  const handleCopyLink = async (meetingId, token) => {
    try {
      const urlToCopy = `${appURL}meeting/${token}`;
      await navigator.clipboard.writeText(urlToCopy);
      setCopiedLinkId(meetingId);
      setTimeout(() => {
        setCopiedLinkId(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const fetchResults = async (meetingId) => {
    try {
      const response = await axios.get(`${apiURL}interview-results/${meetingId}`);
      setResults(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to load results:", error);
    }
  };

  return (
    <div className="col-md-10">
      <h2>Scheduled Meetings</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Sent To</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting) => (
            <tr key={meeting.id}>
              <td className="sent_to" title={meeting?.sent_to}>
              {meeting?.first_name} - {meeting?.last_name} <br></br>
                {meeting?.sent_to}
                </td>
              <td>
                {moment(meeting?.scheduled_at).format("MMM DD YYYY, h:mm A")}
              </td>
              <td>
                <span className={`badge ${meeting.status === "completed" ? "bg-success" : "bg-warning"}`}>
                  {capitalizeFirstLetter(meeting.status)}
                </span>
              </td>
              <td>
                {copiedLinkId === meeting.id ? (
                  <span title="Link Copied!" className="text-success">
                    <i className="bi bi-clipboard-check"></i>
                  </span>
                ) : (
                  <div>
                    <Button variant="link" onClick={() => handleCopyLink(meeting.id, meeting.token)} title="Copy Link">
                      <i className="bi bi-clipboard"></i>
                    </Button>
                    <Button variant="link" onClick={() => fetchResults(meeting.id)} title="See Results">See Results</Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Interview Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {results.map(result => (
            <div key={result.question_id}>
              <p><strong>Question:</strong> {result.question_content}</p>
              {result.answers.map(answer => (
                <p key={answer.id}><strong>Answer:</strong> {answer.content}</p>
              ))}
              {result.evaluations.map(evaluation => (
                <p key={evaluation.id}>
                  <strong>Evaluation:</strong> <br></br>
                  {evaluation.content.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      <span dangerouslySetInnerHTML={{ __html: line }} />
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              ))}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MeetingsList;
