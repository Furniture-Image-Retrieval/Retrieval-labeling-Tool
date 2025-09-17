import React, { useEffect, useState } from "react";
import GalleryGrid from "../components/GalleyGrid.jsx";
import Comparison from "../components/Comparison.jsx";
import Button from "../components/Button.jsx";
import Badge from "../components/Badge.jsx";
import Modal from "../components/Modal.jsx";
import {
  getSelfReidConfig,
  getNextInProgressCheckedConfig,
} from "../context/config.js";
import { useParams } from "react-router-dom";
import getProject from "../services/getProject.js";
import getQuery from "../services/getQuery.js";
import getProjectSummary from "../services/getProjectSummary.js";
import updateQuerySelectedItems from "../services/updateQuerySelectedItems.js";
import Toast from "../components/Toast.jsx";
import { unstable_batchedUpdates } from "react-dom";

const ProjectPage = (props) => {
  const [countOfDoneReidCase, setCountOfDoneReidCase] = useState(0);
  const [reidProject, setReidProject] = useState();
  const [totalReidDones, setTotalReidDones] = useState();
  const [doneQueryIds, setDoneQueryIds] = useState([]);
  const [queryIds, setQueryIds] = useState(undefined);
  const [reidData, setReidData] = useState(undefined);
  const [queryMasterId, setQueryMasterId] = useState(undefined);
  const [isDone, setIsDone] = useState(undefined);
  const [thereIsChange, setThereIsChange] = useState(false)
  const [matchedGalleryIds, setMatchedGalleryIds] = useState([]);
  const [queryIndex, setQueryIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [noMatchIsLoading, setNoMatchIsLoading] = useState(false);

  const [toggle, setToggle] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(false);
  const [toastType, setToastType] = useState("success");
  const { name } = useParams();

  const configs = {
    selfReidIsOn: getSelfReidConfig(),
    nextInProgressIsOn: getNextInProgressCheckedConfig(),
  };

  const findIndexGalleryItemById = (id) => {
    if (reidData) {
      return reidData.top_gallery_items?.findIndex((i) => i.master_id === id);
    }
  };

  const findQueryItemIndexById = (id) => {
    if (reidData) {
      return reidData.findIndex((item) => {
        return item.master_id == id;
      });
    }
  };

  useEffect(() => {
    getProject(name)
      .then((reidProject) => {
        unstable_batchedUpdates(() => {
          setReidProject(reidProject);
          setToggle(!toggle);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    
      getProjectSummary(name)
      .then((summary) => {
        setDoneQueryIds(summary.done_query_ids)
        setQueryIds(summary.query_ids)
        setQueryMasterId(summary.query_ids[queryIndex]);
        setTotalReidDones(summary.total_dones)
      })
    

  }, []);

  useEffect(() => {
    if (reidProject) {
      setQueryMasterId(queryIds[queryIndex]);
    }
  }, [queryIndex]);

  useEffect(() => {
    if (queryMasterId !== undefined) {
      getQuery(reidProject.name, queryMasterId).then((queryData) => {
        unstable_batchedUpdates(() => {
          setReidData(queryData);
          setMatchedGalleryIds(queryData.selected_items);
        });
      });
    }
  }, [queryMasterId]);

  const selectGalleryItem = (id) => {
    unstable_batchedUpdates(() => {
      setMatchedGalleryIds([...matchedGalleryIds, id]);
      setThereIsChange(true);
      setGalleryIndex(findIndexGalleryItemById(id));
    });
  };
  
  const removeGalleryItem = (id) => {
    const filterMatched = matchedGalleryIds.filter(
      (galleryId) => galleryId !== id
    );
    setMatchedGalleryIds([...filterMatched]);
    setThereIsChange(true);
    isDone & setIsDone(false);
  };

  const submitSelectedItems = (onSubmitSuccessfully) => {
    if (matchedGalleryIds !== undefined){
      setSubmitIsLoading(true);
      updateQuerySelectedItems(
        reidProject.name,
        reidData.master_id,
        matchedGalleryIds,
        configs.selfReidIsOn
      ).then(res => {
        if (res && res.succeeded) {
          unstable_batchedUpdates(() => {
            setToastMsg('Query has been updated successfully!')
            setToastType('success')
            setShowToast(true)
            setThereIsChange(false)
            setTotalReidDones(totalReidDones + 1)
          })
          onSubmitSuccessfully && onSubmitSuccessfully()
        } else {
          unstable_batchedUpdates(() => {
            setToastMsg("couldn't update the query!")
            setToastType('danger')
            setShowToast(true)
          })
        }
      }).finally(() => {
        setSubmitIsLoading(false)
      })
    }
  }

  const discardChanges = () => {
    unstable_batchedUpdates(() => {
      setThereIsChange(false)
      setMatchedGalleryIds(reidData.selected_items);
    });
    closeModal();
  };

  const submitNoMatch = () => {
    unstable_batchedUpdates(() => {
      setNoMatchIsLoading(true);
      setToggle(!toggle)
      setTotalReidDones(totalReidDones + 1)
    })

    updateQuerySelectedItems(
      reidProject.name,
      reidData.master_id,
      []
    ).then(() => {
        setToastMsg('Query has been updated successfully!')
        setToastType('success')
        setShowToast(true)
        setToggle(!toggle)
    }).catch((e) => {
      unstable_batchedUpdates(() => {
        setToastMsg(e)
        setToastType('error')
        setShowToast(true)
      })
    })

    unstable_batchedUpdates(() => {
      setThereIsChange(false)
      setMatchedGalleryIds([]);
      setNoMatchIsLoading(false);
    })
  };

  const goNextQuery = () => {
    if (thereIsChange && !modalIsOpen) {
      setModalIsOpen("Next");
      return;
    }
    const next = getNextInProgress();
    unstable_batchedUpdates(() => {
      closeModal();
      setQueryIndex(next);
      setMatchedGalleryIds([]);
    });
  };

  const goPrevQuery = () => {
    if (thereIsChange && !modalIsOpen) {
      setModalIsOpen("Prev");
      return;
    }
    /**
     * TODO: Add config to disable this
     */
    const prev = getPrevInProgress();
    unstable_batchedUpdates(() => {
      closeModal();
      setQueryIndex(prev);
      setMatchedGalleryIds([]);
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  /**
   * 
   * @returns TODO
   */
  const getNextInProgress = () => {
    if (configs.nextInProgressIsOn){
      let tempIndex = Math.min(queryIndex + 1, queryIds.length - 1)
      while (tempIndex < queryIds.length - 1 && (doneQueryIds.includes(Number(queryIds[tempIndex]))) ) {
        tempIndex = tempIndex + 1
      }
      return tempIndex;
    } else {
      return Math.min(queryIndex + 1, queryIds.length - 1)
    }
  };

  const getPrevInProgress = () => {
    if (configs.nextInProgressIsOn){
      let tempIndex = Math.max(queryIndex - 1, 0);
      while (!(doneQueryIds.includes(Number(queryIds[tempIndex]))) && tempIndex >= 0) {
        tempIndex = tempIndex - 1
      }
      return tempIndex;
    } else {
      return Math.max(queryIndex - 1, 0);
    }
  };

  if (reidData) {
    return (
      <div className="px-5 flex flex-col h-[calc(100vh-64px)] ">
        <Toast
          type={toastType}
          showToast={showToast}
          setShowToast={setShowToast}
          toastMsg={toastMsg}
        />
        {modalIsOpen && (
          <Modal
            loading={submitIsLoading}
            onDiscard={discardChanges}
            onClose={closeModal}
            onConfirm={(e) => {
              submitSelectedItems(() => {
                modalIsOpen == "Next" ? goNextQuery() : goPrevQuery();
              });
            }}
            desc="Confirm changes?"
          />
        )}
        <div className="flex justify-between align-center rounded-xl bg-[#121119] my-2 py-2 px-2">
          {reidProject &&
              (<div className='text-gray-300 flex flex-col'>
                  <span>{reidProject.name}</span>
              </div>)
          }
          <div className='flex justify-center align-center '>
            {totalReidDones !== undefined && 
              (<Badge className='ml-4 flex justify-center align-center'>
              {queryIds.length} / {totalReidDones} 
              </Badge>)
            }
            <Button>back</Button>
          </div>
        </div>
        <div className="flex gap-6 overflow-hidden ">
          <div className="overflow-scroll no-scrollbar">
            <GalleryGrid
              matchedGalleryIds={matchedGalleryIds}
              data={reidData.top_gallery_items}
              removeItem={removeGalleryItem}
              selectItem={selectGalleryItem}
            />
          </div>
          <div className="flex-1 flex justify-end">
            <Comparison
              queryItem={reidData}
              galleryItem={reidData.top_gallery_items[galleryIndex]}
              activeQueryindex={queryIndex}
              totlaQueries={queryIds.length}
              submitNoMatch={submitNoMatch}
              submitSelectedItems={() => submitSelectedItems()}
              noMatchIsLoading={noMatchIsLoading}
              submitIsLoading={submitIsLoading}
              onNextQueryClick={goNextQuery}
              onPrevQueryClick={goPrevQuery}
              onEnterQueryIndexDirectly={(value) => {setQueryIndex(value)}}
              thereIsChange={thereIsChange}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default ProjectPage;
