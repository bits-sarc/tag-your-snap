import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from "jwt-decode";
import React, { useState, useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom"
import UIButton from '../components/UIButton';
import LocationPointDetail from '../components/LocationPointDetail';
import { BranchDetail, LocationData } from '../types/api';
import backButtonSvg from '/backButton.svg';

export async function loader({ params }: LoaderFunctionArgs) {
  const branchCode = params.branchCode;

  const url = `http://localhost:1337/snaps/${branchCode}`;
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

export default function TagSnap() {
  const { snapData } = useLoaderData() as { snapData: BranchDetail };
  const navigate = useNavigate();

  const [auth, setAuth] = useState<boolean>(false);
  const [locations, setLocations] = useState<Array<LocationData>>([]);
  const [maxRow, setMaxRow] = useState<number>(0);
  const [currentRow, setCurrentRow] = useState<number>(0);

  const [collapseRows, setCollapseRows] = useState<boolean>(true);
  const [collapseStudents, setCollapseStudents] = useState<boolean>(false);

  const [selectedFace, setSelectedFace] = useState<number>();
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [previousUserId, setPreviousUserId] = useState<number>();

  if (Cookies.get('jwt') !== undefined && !auth) {
    setAuth(true);
  }

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }

    const decoded = jwtDecode(Cookies.get('jwt') as string) as JwtPayload & { branch: string };
    if (decoded.branch !== undefined) navigate("/");

    for (let i = 0; i < snapData.locations.length; i++) {
      const location = snapData.locations[i];

      if (location.row > maxRow) setMaxRow(location.row);
    }

    setLocations(snapData.locations)

  }, []);

  const cancelSelection = () => {
    setSelectedFace(undefined);
    setSelectedUserId(undefined);

    const rest = document.getElementsByClassName("hint-active");
    for (let i = 0; i < rest.length; i++) {
      const element = rest[i];
      element.classList.remove("hint-active");
    }
  }

  useEffect(cancelSelection, [currentRow]);

  useEffect(() => setCollapseStudents(!collapseRows), [collapseRows])

  const selectFace = (e: React.MouseEvent<HTMLElement>) => {
    const location = e.target as any;

    const rest = document.getElementsByClassName("hint-active");
    for (let i = 0; i < rest.length; i++) {
      const element = rest[i];
      element.classList.remove("hint-active");
    }

    setTimeout(() => {
      const best = document.getElementById(`hint-${location.id}`);
      best?.classList.add("hint-active");
    }, 250);

    setSelectedFace(location.id);
    const s = locations.filter(l => l.id == location.id);
    setSelectedUserId(s[0].tag ? s[0].tag.id : undefined);
    setPreviousUserId(s[0].tag ? s[0].tag.id : undefined);

    setCollapseRows(false);
  }

  const saveTagUser = async (_e: React.MouseEvent<HTMLElement>) => {
    const data = [{
      id: selectedFace,
      userprofile_id: selectedUserId,
    }]

    const url = `http://localhost:1337/snaps/${snapData.branch_code}/`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('jwt')}`
      },

      body: JSON.stringify({ taggings: data })
    });

    const json = await response.json();

    if (!json.error) {
      setLocations(json.data);
      setPreviousUserId(selectedUserId);
      setSelectedUserId(selectedUserId);
    }
  }

  const getUserData = (id: number | undefined) => {
    if (!id) return
    return snapData.students.filter((student) => student.id == id)[0];
  }

  return (
    <div className="container m-auto">
      <div className="flex flex-col">
        <div className="flex flex-row justify-center">
          <div className="text-5xl font-gilmer-bold px-8"><img src={backButtonSvg} alt="back" /></div>
          <div className="text-5xl font-gilmer-bold -translate-y-1/4">{snapData.branch_code} {snapData.branch_name}</div>
        </div>

        <div className="flex flex-row mt-10 gap-10">
          <div className="basis-8/12">
            <div className="relative">
              {locations.map((location) => (<LocationPointDetail key={location.id} id={location.id} location={location} currentRow={currentRow} onClick={(e: React.MouseEvent<HTMLElement>) => selectFace(e)} />))}
              <img id="snap-image-anchor" src={snapData != undefined ? ("http://localhost:1337" + snapData.snap_image) : undefined} alt="Batch Snap Image" />
            </div>
            <div className="flex flex-col justify-around gap-4 mt-10 text-2xl">
              {selectedUserId !== previousUserId && selectedUserId != undefined && (
                <>
                  <div className="font-gilmer-bold text-center w-full">Are you sure you want to tag the selected face as <br /> {getUserData(selectedUserId)?.name} : {getUserData(selectedUserId)?.bits_id}</div>
                  <div className="flex flex-row gap-8 px-16">
                    <UIButton onClick={(_e: React.MouseEvent<HTMLElement>) => cancelSelection()} text={"Cancel"} active={false} />
                    <UIButton onClick={(e: React.MouseEvent<HTMLElement>) => saveTagUser(e)} text={"Save"} />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="basis-4/12 flex flex-col">
            <div className="text-3xl font-gilmer-bold flex flex-row justify-between">
              <div>Choose a Row:</div>
              <div className="cursor-pointer select-none border-2 border-amber-300 bg-gradient-to-r from-transparent from-30% to-amber-300 rounded-full text-center" style={{ width: "36px", height: "36px" }} onClick={() => setCollapseRows(!collapseRows)}>
                <div className="-translate-y-1">{!collapseRows ? "+" : "-"}</div>
              </div>
            </div>
            <div className={"transition-max-height ease-in-out flex flex-col items-center gap-2 mt-4"} style={{ zIndex: !collapseRows ? "-1" : "1", maxHeight: !collapseRows ? 0 : "30rem", overflowY: "hidden", overflowX: "unset" }}>
              {[...Array(maxRow + 1).keys()].map((row: number, index: number) => {
                if (index == 0) return (<UIButton key={row} onClick={() => setCurrentRow(row)} text={"Sitting Row 1"} active={currentRow == row} />)
                return (<UIButton key={row} onClick={() => setCurrentRow(row)} text={"Standing Row " + String(row + 1)} active={currentRow == row} />)
              })}
            </div>
            <div className="text-3xl font-gilmer-bold flex flex-row justify-between mt-4">
              <div>Tag a face in the Snap</div>
            </div>
            <div className="text-3xl font-gilmer-bold flex flex-row justify-between mt-4">
              <div>Tag your Name:</div>
              <div className="cursor-pointer select-none border-2 border-amber-300 bg-gradient-to-r from-transparent from-30% to-amber-300 rounded-full text-center" style={{ width: "36px", height: "36px" }} onClick={() => setCollapseStudents(!collapseStudents)}>
                <div className="-translate-y-1">{!collapseStudents ? "+" : "-"}</div>
              </div>
            </div>
            <div className={"transition-max-height ease-in-out flex flex-col items-center gap-2 mt-4"} style={{ zIndex: !collapseStudents ? "-1" : "1", maxHeight: !collapseStudents ? 0 : "30rem", overflowY: "hidden", overflowX: "unset" }}>
              {selectedFace ? snapData.students.map((student) => {
                return (
                  <UIButton key={student.id} onClick={() => setSelectedUserId(student.id)} text={student.name} active={selectedUserId == student.id} />
                )
              }) : (
                <div className="font-gilmer-bold text-xl text-neutral-400">Please select a face</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}