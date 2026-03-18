import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from "jwt-decode";
import React, { useState, useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom"
import UIButton from '../components/UIButton';
import LocationPoint from '../components/LocationPoint';
import { BranchDetail, LocationData } from '../types/api';
import backButtonSvg from '/backButton.svg';
import toast from 'react-hot-toast';

export async function loader({ params }: LoaderFunctionArgs) {
  const branchCode = params.branchCode;
  const url = `https://snaps-api.bits-sarc.in/snaps/${branchCode}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Cookies.get('jwt')}`
    }
  });
  const json = await response.json();
  return { snapData: json.data };
}

export default function TagSnapAdmin() {
  const { snapData } = useLoaderData() as { snapData: BranchDetail };
  const navigate = useNavigate();

  const [auth, setAuth] = useState<boolean>(false);
  const [locations, setLocations] = useState<Array<LocationData>>([]);
  const [maxRow, setMaxRow] = useState<number>(0);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [fakeId, setFakeId] = useState<number>(1);
  const [detecting, setDetecting] = useState<boolean>(false);

  if (Cookies.get('jwt') !== undefined && !auth) setAuth(true);

  useEffect(() => {
    if (!auth) navigate("/");
    let temp = fakeId;
    const decoded = jwtDecode(Cookies.get('jwt') as string) as JwtPayload & { branch: string };
    if (decoded.branch !== undefined) navigate("/");
    for (let i = 0; i < snapData.locations.length; i++) {
      const location = snapData.locations[i];
      snapData.locations[i].fakeId = temp;
      temp++;
      if (location.row > maxRow) setMaxRow(location.row);
    }
    setFakeId(temp);
    setLocations(snapData.locations);
  }, []);

  const addPoint = (e: React.MouseEvent<HTMLElement>) => {
    const snapImg = e.target as HTMLElement;
    const snapRect = snapImg.getBoundingClientRect();
    const percentX = ((e.clientX - snapRect.left) / snapRect.width) * 100;
    const percentY = ((e.clientY - snapRect.top) / snapRect.height) * 100;
    const newLocation: LocationData = {
      fakeId: fakeId, x: percentX, y: percentY,
      row: currentRow, tag: null, locked: false,
    };
    setFakeId(fakeId + 1);
    setLocations([...locations, newLocation]);
  }

  const deletePoint = (e: React.MouseEvent<HTMLElement>) => {
    const locationPoint = e.target as HTMLElement;
    setLocations(locations.filter((location) => String(location.fakeId) != locationPoint.id));
  }

  const saveLocations = async () => {
    const url = `https://snaps-api.bits-sarc.in/snaps/${snapData.branch_code}/`;
    toast("Saving Locations...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('jwt')}`
      },
      body: JSON.stringify({ locations }),
    });
    const json = await response.json();
    if (!json.error) { toast("Locations updated!"); return; }
    toast("Failed to save locations!");
  }

  // ── NEW: Auto-detect faces via AI ─────────────────────────────────────────
  const autoDetectFaces = async () => {
    setDetecting(true);
    toast("Running face detection...");

    try {
      const url = `https://snaps-api.bits-sarc.in/snaps/${snapData.branch_code}/autodetect/`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('jwt')}`
        },
        // replace_all: false means it keeps already-tagged dots safe
        body: JSON.stringify({ replace_all: false }),
      });

      const json = await response.json();

      if (!json.error) {
        // Assign fakeIds to the returned locations so the UI can track them
        let temp = 1;
        const withFakeIds = json.data.map((loc: LocationData) => {
          const withId = { ...loc, fakeId: temp };
          temp++;
          return withId;
        });
        setFakeId(temp);
        setLocations(withFakeIds);

        // Recalculate maxRow from returned data
        const newMax = json.data.reduce((max: number, l: LocationData) => Math.max(max, l.row ?? 0), 0);
        setMaxRow(newMax);

        toast(`Done! ${json.detected} faces detected. Review and save.`);
      } else {
        toast(`Detection failed: ${json.message}`);
      }
    } catch (err) {
      toast("Network error during detection");
      console.error(err);
    } finally {
      setDetecting(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        .admin-page {
          min-height: 100vh;
          padding: 100px 52px 60px;
          overflow-x: auto;
        }
        .admin-inner {
          min-width: 1200px;
          display: flex;
          flex-direction: column;
          max-width: 1400px;
          margin: 0 auto;
        }
        .admin-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 36px;
        }
        .admin-back {
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .admin-back:hover { opacity: 1; }
        .admin-title-wrap { flex: 1; }
        .admin-eyebrow {
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(218,200,109,0.5);
          font-family: 'Courier New', monospace;
          margin-bottom: 6px;
        }
        .admin-title {
          font-family: Georgia, 'Times New Roman', serif;
          font-style: italic;
          font-weight: 900;
          font-size: 36px;
          color: #fff;
        }
        .admin-body {
          display: flex;
          flex-direction: row;
          gap: 40px;
        }
        .admin-snap-col { flex: 1; }
        .admin-snap-img {
          width: 100%;
          cursor: crosshair;
          display: block;
          border: 1px solid rgba(218,200,109,0.1);
        }
        .admin-snap-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .admin-snap-actions > * { flex: 1; }
        .admin-panel {
          width: 240px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .admin-panel-label {
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(218,200,109,0.4);
          font-family: 'Courier New', monospace;
          margin-bottom: 4px;
        }
        .admin-rows { display: flex; flex-direction: column; gap: 6px; }
        .admin-next {
          margin-top: 20px;
          border-top: 1px solid rgba(218,200,109,0.1);
          padding-top: 20px;
        }
        .admin-next-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(218,200,109,0.4);
          font-family: 'Courier New', monospace;
          margin-bottom: 10px;
        }
        .admin-hint {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.25);
          font-family: 'Courier New', monospace;
          line-height: 1.6;
          margin-top: 12px;
        }
        .admin-ai-section {
          border: 1px solid rgba(218,200,109,0.2);
          padding: 16px;
          margin-bottom: 4px;
        }
        .admin-ai-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #DAC86D;
          font-family: 'Courier New', monospace;
          margin-bottom: 10px;
        }
        .admin-ai-hint {
          font-size: 10px;
          color: rgba(255,255,255,0.22);
          font-family: 'Courier New', monospace;
          line-height: 1.6;
          margin-top: 8px;
        }
        .detecting-pulse {
          animation: detecting 1.2s ease-in-out infinite;
        }
        @keyframes detecting {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div className="admin-page">
        <div className="admin-inner">
          <div className="admin-header">
            <div className="admin-back" onClick={() => navigate(-1)}>
              <img src={backButtonSvg} alt="back" width={32} />
            </div>
            <div className="admin-title-wrap">
              <div className="admin-eyebrow">Admin · Face Placement</div>
              <div className="admin-title">{snapData.branch_code} · {snapData.branch_name}</div>
            </div>
          </div>

          <div className="admin-body">
            <div className="admin-snap-col">
              <div style={{ position: 'relative' }}>
                {locations.map((location) => (
                  <LocationPoint
                    key={location.fakeId}
                    id={location.fakeId}
                    location={location}
                    currentRow={currentRow}
                    onClick={(e: React.MouseEvent<HTMLElement>) => deletePoint(e)}
                  />
                ))}
                <img
                  id="snap-image-anchor"
                  src={snapData != undefined ? ("https://snaps-api.bits-sarc.in" + snapData.snap_image) : undefined}
                  alt="Batch Snap Image"
                  className="admin-snap-img"
                  onClick={(e: React.MouseEvent<HTMLElement>) => addPoint(e)}
                />
              </div>
              <div className="admin-snap-actions">
                <UIButton onClick={() => navigate(0)} text="Reset" />
                <UIButton onClick={() => saveLocations()} text="Save →" />
              </div>
            </div>

            <div className="admin-panel">

              {/* ── AI Auto-detect section ── */}
              <div className="admin-ai-section">
                <div className="admin-ai-label">AI Face Detection</div>
                <div className={detecting ? 'detecting-pulse' : ''}>
                  <UIButton
                    onClick={autoDetectFaces}
                    text={detecting ? "Detecting..." : "Auto-detect Faces ✦"}
                    active={detecting}
                  />
                </div>
                <div className="admin-ai-hint">
                  Automatically places dots on all detected faces. Tagged dots are preserved. Review and save when done.
                </div>
              </div>

              <div className="admin-panel-label">Select Row</div>
              <div className="admin-rows">
                {[...Array(maxRow + 1).keys()].map((row: number, index: number) => (
                  <UIButton
                    key={row}
                    onClick={() => setCurrentRow(row)}
                    text={index == 0 ? "Sitting Row 1" : `Standing Row ${row}`}
                    active={currentRow == row}
                  />
                ))}
                <UIButton onClick={() => setMaxRow(maxRow + 1)} text="+ Add Row" />
              </div>

              <div className="admin-hint">Click anywhere on the image to place a face marker. Click a marker to remove it.</div>

              <div className="admin-next">
                <div className="admin-next-label">Next Step</div>
                <UIButton onClick={() => navigate(`/tag/${snapData.branch_code}`)} text="Go to Tagging →" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
