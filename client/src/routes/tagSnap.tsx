import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useDebouncedCallback } from 'use-debounce';
import React, { useState, useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate, useParams } from "react-router-dom"
import UIButton from '../components/UIButton';
import LocationPointDetail from '../components/LocationPointDetail';
import { BranchDetail, LocationData, Student } from '../types/api';
import backButtonSvg from '/backButton.svg';
import Magnifier from 'react-magnifier';
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

export default function TagSnap() {
  const { snapData } = useLoaderData() as { snapData: BranchDetail };
  const { branchCode } = useParams();
  const navigate = useNavigate();

  const [auth, setAuth] = useState<boolean>(false);
  const [locations, setLocations] = useState<Array<LocationData>>([]);
  const [maxRow, setMaxRow] = useState<number>(0);

  const [collapseStudents, setCollapseStudents] = useState<boolean>(false);

  const [selectedFace, setSelectedFace] = useState<number>();
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [previousUserId, setPreviousUserId] = useState<number>();

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  if (Cookies.get('jwt') !== undefined && !auth) {
    setAuth(true);
  }

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }

    const decoded = jwtDecode(Cookies.get('jwt') as string) as JwtPayload & { branch: string };
    if (decoded.branch !== undefined && decoded.branch !== branchCode) navigate("/");

    for (let i = 0; i < snapData.locations.length; i++) {
      const location = snapData.locations[i];

      if (location.row > maxRow) setMaxRow(location.row);
    }

    setLocations(snapData.locations)
    setFilteredStudents(snapData.students);
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

  const selectFace = (e: React.MouseEvent<HTMLElement>) => {
    const location = e.target as any;

    const rest = document.getElementsByClassName("hint-active");
    for (let i = 0; i < rest.length; i++) {
      const element = rest[i];
      element.classList.remove("hint-active");
      element.parentElement?.classList.remove("clicked-state");
    }

    setTimeout(() => {
      const best = document.getElementById(`hint-${location.id}`);
      best?.classList.add("hint-active");

      best?.parentElement?.classList.add("clicked-state");
    }, 250);

    setSelectedFace(location.id);
    const s = locations.filter(l => l.id == location.id);
    setSelectedUserId(s[0].tag ? s[0].tag.id : undefined);
    setPreviousUserId(s[0].tag ? s[0].tag.id : undefined);

    setCollapseStudents(true);
  }

  const saveTagUser = async (_e: React.MouseEvent<HTMLElement>) => {
    const data = [{
      id: selectedFace,
      userprofile_id: selectedUserId,
    }]

    const url = `https://snaps-api.bits-sarc.in/snaps/${snapData.branch_code}/`;
    toast("Saving...");
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

      toast("Updated tag!");
      return
    }

    toast("Failed to updated locations!");
  }

  const getUserData = (id: number | undefined) => {
    if (!id) return
    return snapData.students.filter((student) => student.id == id)[0];
  }

  const filterStudents = useDebouncedCallback((value: string) => {
    setFilteredStudents(snapData.students.filter((student) => student.name.toLowerCase().includes(value.toLowerCase()) || student.bits_id.toLowerCase().includes(value.toLowerCase())))
  }, 300);

  return (
    <div className="m-auto pt-48 overflow-x-scroll overflow-y-visible px-8 md:px-16 lg:px-24 xl:32">
      <div className="flex flex-col min-w-[1200px]">
        <div className="flex flex-row justify-center">
          <div className="text-5xl font-gilmer-bold -translate-y-1/4 relative">
            <div className="absolute text-5xl font-gilmer-bold px-8" style={{ left: '-100px', top: '25%' }} onClick={() => navigate(-1)}><img src={backButtonSvg} alt="back" /></div>
            <div>
              {snapData.branch_code} {snapData.branch_name}
            </div>
          </div>
        </div>

        <div className="flex flex-row mt-10 gap-10">
          <div className="basis-9/12">
            <div className="relative">
              {locations.map((location) => (<LocationPointDetail key={location.id} id={location.id} location={location} onClick={(e: React.MouseEvent<HTMLElement>) => selectFace(e)} />))}
              {/* @ts-ignore */}
              <Magnifier src={snapData != undefined ? ("https://snaps-api.bits-sarc.in" + snapData.snap_image) : ""} width="100%" mgWidth={150} mgHeight={150} zoomFactor={2} mgMouseOffsetY={-120} />
            </div>
            <div className="flex flex-col justify-around gap-4 my-10 text-2xl">
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
          <div className="basis-3/12 flex flex-col">
            <div className="text-xl font-gilmer-medium text-neutral-400 flex flex-row justify-between mt-4">
              <div>Hover and click on a face to select it.</div>
            </div>
            <div className="text-3xl font-gilmer-bold flex flex-row justify-between mt-4">
              <div>Tag your Name:</div>
              <div className="cursor-pointer select-none border-2 border-amber-300 bg-gradient-to-r from-transparent from-30% to-amber-300 rounded-full text-center" style={{ width: "36px", height: "36px" }} onClick={() => setCollapseStudents(!collapseStudents)}>
                <div className="-translate-y-1">{!collapseStudents ? "+" : "-"}</div>
              </div>
            </div>
            <div className={"transition-max-height ease-in-out flex flex-col items-center gap-2 mt-4"} style={{ zIndex: !collapseStudents ? "-1" : "1", maxHeight: !collapseStudents ? 0 : "600px", overflowY: "hidden", overflowX: "unset" }}>
              <input type="text" className="bg-transparent border-b-2 border-neutral-500 w-11/12 px-3 py-1 mb-2 font-gilmer-bold focus:border-neutral-100 outline-0" placeholder="Search" onChange={(e) => filterStudents(e.target.value)} />
              <div className="overflow-y-scroll">
                {selectedFace ? filteredStudents.map((student) => {
                  return (
                    <div className="mt-2 mr-2">
                      <UIButton key={student.id} onClick={() => setSelectedUserId(student.id)} text={student.name} active={selectedUserId == student.id} />
                    </div>
                  )
                }) : (
                  <div className="font-gilmer-bold text-xl text-neutral-400">Please select a face</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}