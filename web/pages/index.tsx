import Head from "next/head";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from 'react-bootstrap';

interface UrlObject {
  url: string;
  code: string;
  clicked: number;
}

interface HomeProps {
  urlList: UrlObject[];
}

const Home: React.FC<HomeProps> = ({ urlList }) => {
  const [data, setData] = useState<UrlObject[]>(urlList);
  const [newUrl, setNewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false); 
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/urls");
        if (response.ok) {
          const urls: UrlObject[] = await response.json();
          setData(urls);
        } else {
          console.error("Failed to fetch URLs");
        }
      } catch (error) {
        console.error("Error fetching URLs:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUrls();
  }, []);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const urlExists = data.some((item) => item.url === newUrl);
  
    if (urlExists) {
      alert("URL already exists in the list."); 
      return;
    }
  
    const _newUrl = newUrl;
    setNewUrl("");
    setIsLoading(true);
  
    try {
      const response = await fetch("http://localhost:5000/api/urls/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: _newUrl }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }
  
      const content: { shortUrl: string } = await response.json();
      if (content) {
        setData([
          { url: _newUrl, code: content.shortUrl, clicked: 0 },
          ...data,
        ]);
      }
    } catch (error) {
      console.error("Error submitting URL:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <Head>
        <title>URL Shortener</title>
      </Head>
      <main className="content">
        <div className="container">
          <h2 className="mb-3">URL Shortener</h2>
          <form className="mb-3" onSubmit={handleOnSubmit}>
            <input
              type="text"
              className="w-75"
              placeholder="Enter long URL..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-dark mx-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Short URL"}
            </button>
          </form>

          {isFetching ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="table-responsive custom-table-responsive">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th scope="col">Long URL</th>
                    <th scope="col">Short URL</th>
                    <th scope="col">Clicked</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((urlObject) => (
                    <React.Fragment key={urlObject.code}>
                      <tr>
                        <td>
                          <a
                            href={urlObject.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {urlObject.url && urlObject.url.slice(0, 120)}
                            {urlObject.url && urlObject.url.length > 120
                              ? "..."
                              : ""}
                          </a>
                        </td>
                        <td>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`http://localhost:5000/${urlObject.code}`}
                          >
                            {urlObject.code}
                          </a>
                        </td>
                        <td>{urlObject.clicked}</td>
                      </tr>
                      <tr className="spacer">
                        <td colSpan={3}></td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export async function getServerSideProps() {
  try {
    console.log('dd')
    const res = await fetch("http://localhost:5000/api/urls");
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    const urlList: UrlObject[] = await res.json();

    return {
      props: {
        urlList,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        urlList: [],
      },
    };
  }
}

export default Home;
