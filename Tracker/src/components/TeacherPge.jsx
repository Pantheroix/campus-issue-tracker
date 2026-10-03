import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TeacherPge() {
  const location = useLocation();
  const [showComment, SetShowComment] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [issue_id, setIssue_id] = useState("");

  const HandelTChange = (event) => {
    const text = event.target.value;

    setComment(text);
  };
  useEffect(() => {
    const FetchComments = async () => {
      if (!issue_id) return;

      const api = `http://localhost:3000/api/teach/issues/${issue_id}/comments`;
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
  const HandelCSubmit = async (event, issue_id) => {
    event.preventDefault();

    try {
      const api = `http://localhost:3000/api/teach/issues/${issue_id}/comments/add`;

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

  const [issues, setissues] = useState([
    {
      name: "",
      role: "",
      title: "",
      category: "",
      description: "",
      location: "",
      status: "",
    },
  ]);

  const data = location.state;

  useEffect(() => {
    const getisseus = async () => {
      const api = `http://localhost:3000/api/teach/issues`;

      const token = localStorage.getItem("token");

      try {
        const response = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        });

        const responsedata = await response.json();

        if (response.ok) {
          setissues(responsedata.data);
          console.log(responsedata.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getisseus();
  }, []);

  const [status, setstatus] = useState("");
  const [sissue_id, setsIssue_id] = useState("");

  useEffect(() => {
    if (!sissue_id) return;
    const setStatus = async () => {
      const api = `http://localhost:3000/api/teach/issues/${sissue_id}/status`;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(api, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },

          body: JSON.stringify({
            status: status,
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

    setStatus();
  }, [status, sissue_id]);
  return (
    <>
      <p>Welcome to your profile Admin! {data.name}</p>
      <div>
        <div>
          {issues.map((element, index) => (
            <div key={index}>
              <div>
                <h3>{element.name}</h3>
                <p>{element.role}</p>
                <p>{element.title}</p>
                <p>{element.category}</p>
                <p>{element.description}</p>
                <p>{element.location}</p>
                <p>{element.status}</p>
                <button
                  onClick={() => {
                    setstatus("inprogress");
                    setsIssue_id(element.issue_id);
                  }}
                >
                  Inprogress
                </button>
                <button
                  onClick={() => {
                    setstatus("Resolved");
                    setsIssue_id(element.issue_id);
                  }}
                >
                  Resolved
                </button>
              </div>
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
