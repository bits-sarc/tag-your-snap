import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useLoaderData, useNavigate } from 'react-router-dom';
import UIButton from '../components/UIButton';
import { Branch } from '../types/api';
import toast from 'react-hot-toast';

export async function loader(): Promise<{ fetchedBranches: Branch[] }> {
  const url = "https://snaps-api.bits-sarc.in/snaps/";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Cookies.get('jwt')}`
    }
  });

  const json = await response.json();

  return { fetchedBranches: json.data };
}

export default function Tag() {
  const [auth, setAuth] = useState<boolean>(false);
  const [currentBranch, setCurrentBranch] = useState<Branch>();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

  const { fetchedBranches } = useLoaderData() as { fetchedBranches: Array<Branch> };
  const navigate = useNavigate();

  if (Cookies.get('jwt') !== undefined && !auth) {
    setAuth(true);
  }

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }

    setBranches(fetchedBranches);
    setFilteredBranches(fetchedBranches);
    setCurrentBranch(branches[0]);
  }, []);

  const filterBranches = (value: string) => {
    setFilteredBranches(branches.filter((branch) => branch.branch_name.toLowerCase().includes(value.toLowerCase()) || branch.branch_code.toLowerCase().includes(value.toLowerCase())));
  };

  // TODO:
  // Mark the branch as done
  const markDone = async () => {
    if (!currentBranch) return;

    const url = `https://snaps-api.bits-sarc.in/snaps/`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('jwt')}`
      },

      body: JSON.stringify({ branch_code: currentBranch.branch_code, is_done: !currentBranch.is_done })
    });

    const json = await response.json();

    if (!json.error) {
      setCurrentBranch(json.data);
      setBranches([...branches.filter(branch => branch.branch_code != currentBranch.branch_code), json.data]);
      toast(`${currentBranch.branch_code} ${!currentBranch.is_done ? "set to done" : "unset"}`);
      return;
    }
    toast("Failed to set done");
  }

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
            <UIButton onClick={() => markDone()} text={`${!currentBranch?.is_done ? "Set Done" : "Unset Done"}`} />
            <UIButton onClick={() => navigate(`/admin/tag/${currentBranch != undefined && currentBranch.branch_code}`)} text="Start" />
          </div>
        </div>
        <div className="flex flex-col w-full px-8 basis-4/12 max-h-[600px]">
          <input type="text" className="bg-transparent border-b-2 border-neutral-500 w-11/12 px-3 py-1 mb-2 font-gilmer-bold focus:border-neutral-100 outline-0" placeholder="Search" onChange={(e) => filterBranches(e.target.value)} />
          <div className="overflow-y-scroll">
            {filteredBranches.map((branch) => {
              return (
                <div className="mt-2 mr-2">
                  <UIButton key={branch.branch_code} onClick={() => setCurrentBranch(branch)} text={branch.branch_name} active={currentBranch && currentBranch.branch_code == branch.branch_code} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}