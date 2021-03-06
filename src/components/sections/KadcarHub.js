import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import Modal from '../elements/Modal';
import { DEFAULT_GAS_PRICE, DEFAULT_NETWORK_ID, LOCAL_CHAIN_ID, NETWORK_ID, SCREEN_NAMES } from '../../utils/Constants';
import { connectKadena, disconnectKadena, getAccountSelected, getKadenaConnectStatus, getSelectedAccount, getUserWallet } from '../../wallets/KadenaApi';
import { useGetMyKadcarsFunction, useGetAllKadcars, useGetMyKadcars } from '../../pact/KadcarExtractor';
import { useCheckForXWalletExtension } from '../../hooks/BrowserExtensionHooks';
import { useCheckKadenaAccountConnection } from '../../hooks/KadenaCustomHooks';
import { PactContext } from '../../pact/PactContextProvider';
import { MainHeaderScreenContainer } from '../kadcarcomponents/KadcarComponents';
import { KadcarGameContext } from '../kadcarcomponents/KadcarGameContext';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const KadcarHub = ({ className, topOuterDivider, bottomOuterDivider, topDivider, bottomDivider, hasBgColor, invertColor, ...props }) => {
  //Get PactContext and KadcarGameContext
  const { account, chainId, setAccount, setChainId, setNetworkSettings, useSetNetworkSettings } = useContext(PactContext); 
  const { setCurrentScreen, setMyKadcars } = useContext(KadcarGameContext);

  //Check if the user has the X-Wallet extension installed
  const extensionInstalled = useCheckForXWalletExtension();
  //Check if the user has their X-Wallet account connected to this app
  // const kadenaConnected = useCheckKadenaAccountConnection(extensionInstalled); 
  
  //Set network settings
  useSetNetworkSettings(NETWORK_ID, localStorage.getItem(LOCAL_CHAIN_ID));

  //Kadcar hook calls
  const currentUserKadcarFunction = useGetMyKadcarsFunction();
  const currentUserKadcarNfts = useGetMyKadcars();
  const allKadcarNfts = useGetAllKadcars();

  const [videoModalActive, setVideomodalactive] = useState(false);
  const [showWalletNameModal, setShowWalletModal] = useState(false);


  const openModal = (e) => {
    e.preventDefault();
    setVideomodalactive(true);
  }

  const closeModal = (e) => {
    e.preventDefault();
    setVideomodalactive(false);
  }

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  useEffect(() => {
    // console.log(account)
  }, [account]);
 
  // useEffect(() => {
  //   console.log(currentUserKadcarNfts)
  // }, [currentUserKadcarNfts]);

  //Handle connecting user's X-Wallet
  function initiateKadenaConnection() {
    //Variable to hold required pact context parameters
    var pactContextObject = null; 
    
    //Check if user has x-wallet downloaded
    if (window.kadena) {
      //Encapsulate all PactContext parameters to be modified by the API call as needed
      pactContextObject = {
        account: account,
        chainId: chainId,
        setAccount: setAccount,
        setChainId: setChainId,
        setNetworkSettings: setNetworkSettings
      }
  
      //Connect this user's account to the app
      connectKadena(pactContextObject); 
    } else {
      //TODO: render error to install extension
    }
  }

  //Disconnect the user's account from the app
  function disconnectKadenaAccount() {
    //Encapsulate all PactContext parameters to be modified by the API call as needed
    var pactContextObject = {
      account: account,
      chainId: chainId,
      setAccount: setAccount,
      setChainId: setChainId,
      setNetworkSettings: setNetworkSettings
    }

    //Call the API function to disconnect this user's wallet from the app
    disconnectKadena(pactContextObject); 
  }

  //Display all this user's kadcars
  async function displayCurrentUserKadcars() {
    setMyKadcars(currentUserKadcarNfts);
    setCurrentScreen(SCREEN_NAMES.MY_KADCARS);

    // const connectStatus = getKadenaConnectStatus();

    // if (connectStatus) {
    //   // getMyKadcars();
    // } else {
    // }
  }

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content" style={{ marginBottom: '20px' }}>
            <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              Build the Ultimate <span className="text-color-primary">Kadcar</span>!
            </h1>
            <div className="container-sm">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
                Our landing page template works on all devices, so you only have to set it up once, and get beautiful results forever.
              </p>
              <div className="reveal-from-bottom" data-reveal-delay="600">
                <ButtonGroup>
                  {
                    !extensionInstalled && 
                    <Button tag="a" color="primary" wideMobile href={"https://xwallet.kaddex.com/#ux"}>
                      Install X-Wallet
                    </Button>
                  }
                  {
                    extensionInstalled && account === null &&
                    <Button onClick={initiateKadenaConnection} tag="a" color="primary" wideMobile>
                      Connect X-Wallet
                     </Button>
                  }
                  {
                    extensionInstalled && account !== null &&
                    <Button onClick={disconnectKadenaAccount} tag="a" color="primary" wideMobile>
                      Disconnect X-Wallet
                    </Button>
                  }
                  <Button tag="a" color="dark" wideMobile>
                    Mint Kadcar
                  </Button>
                  <Button onClick={displayCurrentUserKadcars} tag="a" color="dark" wideMobile>
                    My Cars
                  </Button>
                  <Button tag="a" color="dark" wideMobile>
                    All Kadcars
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
          {/* <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
              <Image
                className="has-shadow"
                src={require('./../../assets/images/video-placeholder.jpg')}
                alt="Hero"
                width={896}
                height={504}
              />
          </div> */}
          <div>
            <MainHeaderScreenContainer/>
          </div>
          {/* <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
            <a
              data-video="https://player.vimeo.com/video/174002812"
              href="#0"
              aria-controls="video-modal"
              onClick={openModal}
            >
              <Image
                className="has-shadow"
                src={require('./../../assets/images/video-placeholder.jpg')}
                alt="Hero"
                width={896}
                height={504}
              />
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
}

KadcarHub.propTypes = propTypes;
KadcarHub.defaultProps = defaultProps;

export default KadcarHub;