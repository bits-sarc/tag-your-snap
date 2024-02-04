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

  if (Cookies.get('jwt') !== undefined && !auth) {
    setAuth(true);
  }

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }

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
    setLocations(snapData.locations)

  }, []);

  const addPoint = (e: React.MouseEvent<HTMLElement>) => {
    const snapImg = e.target as HTMLElement;
    const snapRect = snapImg.getBoundingClientRect();

    const anchorX = snapRect.left;
    const anchorY = snapRect.top;

    const percentX = ((e.clientX - anchorX) / snapRect.width) * 100;
    const percentY = ((e.clientY - anchorY) / snapRect.height) * 100;

    const newLocation: LocationData = {
      fakeId: fakeId,
      x: percentX,
      y: percentY,
      row: currentRow,
      tag: null,
      locked: false,
    }

    setFakeId(fakeId + 1);
    setLocations([...locations, newLocation]);
  }

  const deletePoint = (e: React.MouseEvent<HTMLElement>) => {
    const locationPoint = e.target as HTMLElement;

    const filteredLocations = locations.filter((location) => String(location.fakeId) != locationPoint.id)
    setLocations(filteredLocations);
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

    if (!json.error) {
      toast("Locations updated!");
      return;
    }

    toast("Failed to save locations!");
  }

  return (
    <div className="m-auto pt-48 overflow-x-scroll overflow-y-visible px-8 md:px-16 lg:px-24 xl:32">
      <div className="flex flex-col min-w-[1200px]">
        <div className="flex flex-row justify-center">
          <div className="text-5xl font-gilmer-bold px-8" onClick={() => navigate(-1)}><img src={backButtonSvg} alt="back" /></div>
          <div className="text-5xl font-gilmer-bold -translate-y-1/4">{snapData.branch_code} {snapData.branch_name}</div>
        </div>

        <div className="flex flex-row mt-10 gap-10">
          <div className="basis-9/12">
            <div className="relative">
              {locations.map((location) => (<LocationPoint key={location.fakeId} id={location.fakeId} location={location} currentRow={currentRow} onClick={(e: React.MouseEvent<HTMLElement>) => deletePoint(e)} />))}
              <img id="snap-image-anchor" src={snapData != undefined ? ("https://snaps-api.bits-sarc.in" + snapData.snap_image) : undefined} alt="Batch Snap Image" onClick={(e: React.MouseEvent<HTMLElement>) => addPoint(e)} />
            </div>
            <div className="flex flex-row justify-around gap-4 px-32 mt-8 mb-10">
              <UIButton onClick={() => navigate(0)} text={"Reset"} />
              <UIButton onClick={() => saveLocations()} text={"Save"} />
            </div>
          </div>
          <div className="basis-3/12 flex flex-col">
            <div className="text-3xl font-gilmer-bold flex flex-row justify-between">
              <div>Choose a Row:</div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {[...Array(maxRow + 1).keys()].map((row: number, index: number) => {
                if (index == 0) return (<UIButton key={row} onClick={() => setCurrentRow(row)} text={"Sitting Row 1"} active={currentRow == row} />)
                return (<UIButton key={row} onClick={() => setCurrentRow(row)} text={"Standing Row " + String(row)} active={currentRow == row} />)
              })}
              <UIButton onClick={() => setMaxRow(maxRow + 1)} text={"+ Add Row"} />
            </div>
            <div className="text-3xl font-gilmer-bold flex flex-row justify-between mt-4">
              <div>Mark a face in the Snap</div>
            </div>
            <div className="text-3xl font-gilmer-bold flex flex-row justify-between mt-4">
              <div className="w-full pt-2">Next Step:</div> <UIButton onClick={() => navigate(`/tag/${snapData.branch_code}`)} text={"Go"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}