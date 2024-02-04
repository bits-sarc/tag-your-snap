import { MouseEventHandler, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useLoaderData, useNavigate } from 'react-router-dom';
import UIButton from '../components/UIButton';
import { Branch } from '../types/api';

export async function loader(): Promise<{ branches: Branch[] }> {
  const url = "https://snaps-api.bits-sarc.in/snaps/";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Cookies.get('jwt')}`
    }
  });

  const json = await response.json();

  return { branches: json.data };
}

export default function Tag() {
  const [auth, setAuth] = useState<boolean>(false);
  const [currentBranch, setCurrentBranch] = useState<Branch>();

  const { branches } = useLoaderData() as { branches: Array<Branch> };
  const navigate = useNavigate();

  if (Cookies.get('jwt') !== undefined && !auth) {
    setAuth(true);
  }

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }

    setCurrentBranch(branches[0]);
  }, []);

  // TODO:
  // Mark the branch as done

  return (
    <div className="m-auto pt-48 overflow-x-scroll overflow-y-visible px-8 md:px-16 lg:px-24 xl:32">
      <div className="w-full bg-dark flex flex-row min-w-[1200px]">
        <div className="flex flex-col w-full px-8 basis-8/12">
          <div className="font-gilmer-bold text-5xl text-center">Select Branch</div>
          <div className="flex flex-row justify-around mt-12">
            <img src={currentBranch != undefined ? ("https://snaps-api.bits-sarc.in" + currentBranch.snap_image) : undefined} alt="Batch Snap Image" />
          </div>
          <div style={{ fontSize: "30px" }} className="mt-10 text-center font-gilmer-bold">
            {currentBranch != undefined && (currentBranch.branch_code + " " + currentBranch.branch_name)}
          </div>
          <div className="flex flex-row gap-4 justify-items-stretch mt-4 mb-10">
            <UIButton onClick={(e: MouseEventHandler) => console.log(e)} text="Mark as Done" />
            <UIButton onClick={() => navigate(`/admin/tag/${currentBranch != undefined && currentBranch.branch_code}`)} text="Start" />
          </div>
        </div>
        <div className="flex flex-col w-full px-8 basis-4/12">
          {branches.map((branch) => {
            return (
              <div onClick={() => setCurrentBranch(branch)} style={{ fontSize: "28px" }} className={"cursor-pointer mt-4 p-2 text-center border-4 rounded-lg border-neutral-600 font-gilmer-medium " + ((currentBranch && currentBranch.branch_code == branch.branch_code) ? "bg-neutral-300/50" : "bg-neutral-100/20")} key={branch.branch_code}>
                {branch.branch_code} {branch.branch_name}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}