import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function StudentIssue() {
  const location = useLocation();

  const [comment, setComment] = useState("");

  const [showComment, SetShowComment] = useState(null);

  const HandelChange = (event) => {
    const { id, value } = event.target;
    setIssue((prevdata) => ({
      ...prevdata,
      [id]: value,
    }));
  };

  const HandelTChange = (event) => {
    const text = event.target.value;

    setComment(text);
  };

  const data = location.state;

  const [userIssues, setuserIssues] = useState([
    {
      title: "",
      description: "",
      category: "",
      location: "",
      status: "",
    },
  ]);

  const [issue, setIssue] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  useEffect(() => {
    const fetchPcomplains = async () => {
      const api = "http://localhost:3000/api/fetch/issues";
      const token = localStorage.getItem("token");

      const response = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
      });

      const resdata = await response.json();

      if (response.ok) {
        setuserIssues(resdata.fdata);
      }
    };

    fetchPcomplains();
  }, []);

  const HandelSubmit = async (event) => {
    event.preventDefault();
    const api = "http://localhost:3000/api/issues";

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },

        body: JSON.stringify(issue),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const HandelCSubmit = async (event, issue_id) => {
    event.preventDefault();

    try {
      const api = `http://localhost:3000/api/issues/${issue_id}/comments/add`;

      const token = localStorage.getItem("token");

      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify({
          comment: comment,
        }),
      });

      const responsedata = await response.json();

      if (response.ok) {
        console.log(responsedata);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [issue_id, setIssue_id] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const FetchComments = async () => {
      if (!issue_id) return;

      const api = `http://localhost:3000/api/issues/${issue_id}/comments`;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(api, {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        });

        const responsedata = await response.json();

        if (response.ok) {
          setComments(responsedata.data || []);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.log(err);
        setComments([]);
      }
    };

    FetchComments();
  }, [issue_id]);
  return (
    <>
      <div className="mainsec">
        <div>
          <h1>Welcome to your profile! {data.name}</h1>
        </div>
        <form onSubmit={HandelSubmit}>
          <label htmlFor="title">Enter the title</label>
          <br />
          <input
            id="title"
            type="text"
            onChange={HandelChange}
            value={issue.title}
          />
          <br />
          <label htmlFor="Description">Enter the Description</label>
          <br />
          <textarea
            id="description"
            type="text"
            onChange={HandelChange}
            value={issue.description}
          />
          <br />
          <label htmlFor="category">Enter the category</label>
          <br />
          <input
            id="category"
            type="text"
            onChange={HandelChange}
            value={issue.category}
          />
          <br />
          <label htmlFor="location">Enter the location</label>
          <br />
          <input
            id="location"
            type="text"
            onChange={HandelChange}
            value={issue.location}
          />
          <br />

          <input type="submit" />
        </form>
        <div>
          {userIssues.map((element, index) => (
            <div key={index}>
              <h3>{element.title}</h3>
              <p>{element.description}</p>
              <p>{element.category}</p>
              <p>{element.location}</p>
              <p>{element.status}</p>
              {showComment == element.issue_id && (
                <div>
                  <button
                    onClick={() => {
                      SetShowComment(false);
                    }}
                  >
                    Hide
                  </button>
                  <div className="prevcoms">
                    {comments.length > 0 ? (
                      comments.map((commentItem, index) => (
                        <div key={index}>
                          <p>
                            <strong>{commentItem.name}:</strong>{" "}
                            {commentItem.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>here will be the comments</p>
                    )}
                  </div>
                  <form
                    onSubmit={(event) => {
                      HandelCSubmit(event, element.issue_id);
                      setComment("");
                    }}
                  >
                    <input
                      type="text"
                      id="comment"
                      onChange={HandelTChange}
                      value={comment}
                    />

                    <input type="submit" value="Submit" />
                  </form>
                </div>
              )}
              <button
                onClick={() => {
                  SetShowComment(element.issue_id);
                  setIssue_id(element.issue_id);
                }}
              >
                comment
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
