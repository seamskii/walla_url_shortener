import Head from "next/head";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface UrlObject {
  url: string;
  code: string;
  clicked: number;
}

interface HomeProps {
  urlList: UrlObject[];
}

export default function Home({ urlList }: HomeProps) {
  const [data, setData] = useState<UrlObject[]>(urlList);
  const [newUrl, setNewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const _newUrl = newUrl;
    setNewUrl("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: _newUrl }),
      });

      const content = await response.json();
      if (content) {
        setData([content, ...data]);
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
        <title>Url-Shorten</title>
      </Head>
      <main className="content">
        <div className="container">
          <h2 className="mb-3">URL-Shorten</h2>
          <form className="mb-3" onSubmit={handleOnSubmit}>
            <input
              type="text"
              className="w-75"
              placeholder="Enter long url..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-dark mx-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Short Url"}
            </button>
          </form>

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
                        <a href={urlObject.url}>
                          {urlObject.url.slice(0, 120)}
                          {urlObject.url.length > 120 ? "..." : ""}
                        </a>
                      </td>
                      <td>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`/api/${urlObject.code}`}
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
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
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
