import React from 'react'
import clsx from 'clsx'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { useGlobalState, useGlobalMutation } from '../../utils/container'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import useRouter from '../../utils/use-router'
import { Link } from 'react-router-dom'
import AgoraRTC from 'agora-rtc-sdk'

const CustomRadio = withStyles({
  root: {
    color: '#999999',
    '&$checked': {
      color: '#44A2FC'
    },
    '&:hover': {
      backgroundColor: 'inherit'
    }
  }
})(({ children, ...props }) => {
  return (
    <div className={`role-item ${props.checked ? 'active' : 'inactive'}`} onClick={(evt) => {
      props.onClick(props)
    }}>
      <div className={`icon-${props.value}`}></div>
      <div className={`radio-row ${props.value}`}>
        <div className="custom-radio">
          <input
            readOnly
            type="radio"
            value={props.value}
            checked={props.checked}
          />
          <div className="checkmark"></div>
        </div>
        <Box
          flex="1"
          className={`role-name ${props.checked ? 'active' : 'inactive'}`}
        >
          {props.value}
        </Box>
      </div>
    </div>
  )
})

const useStyles = makeStyles((theme) => ({
  fontStyle: {
    color: '#9ee2ff'
  },
  midItem: {
    marginTop: '1rem',
    marginBottom: '6rem'
  },
  item: {
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  coverLeft: {
    background: 'linear-gradient(to bottom, #307AFF, 50%, #46cdff)',
    alignItems: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  coverContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    color: '#fff'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    display: 'flex',
    minWidth: 700,
    minHeight: 500,
    maxHeight: 500,
    borderRadius: '10px',
    boxShadow: '0px 6px 18px 0px rgba(0,0,0,0.2)'
  },
  input: {
    maxWidth: '250px',
    minWidth: '250px',
    alignSelf: 'center'
  },
  grid: {
    margin: '0 !important'
  },
  button: {
    lineHeight: '21px',
    color: 'rgba(255,255,255,1)',
    fontSize: '17px',
    textTransform: 'none',
    height: '44px',
    width: '260px',
    '&:hover': {
      backgroundColor: '#82C2FF'
    },
    margin: theme.spacing(1),
    marginTop: '33px',
    backgroundColor: '#44a2fc',
    borderRadius: '30px'
  },
  radio: {
    padding: '0',
    fontSize: '14px',
    // display: 'flex',
    alignItems: 'center',
    paddingRight: '5px'
  }
}))

export default function IndexCard () {
  const classes = useStyles()

  const routerCtx = useRouter()
  const stateCtx = useGlobalState()
  const mutationCtx = useGlobalMutation()

  const handleClick = () => {
    if (!stateCtx.config.channelName) {
      mutationCtx.toastError('You need enter the topic')
      return
    }

    mutationCtx.startLoading()
    routerCtx.history.push({
      pathname: `/meeting/${stateCtx.config.channelName}`
    })
  }

  const handleChange = (evt) => {
    const { value, checked } = evt
    console.log('value', evt)
    mutationCtx.updateConfig({
      host: value === 'host'
    })
  }

  return (
    <Box
      marginTop="114px"
      flex="1"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      flexDirection="column"
    >
      <Link to="/setting" className="setting-btn" />
      <span className="version">Web SDK Version: {AgoraRTC.VERSION}</span>
      <a
        href="https://github.com/AgoraIO/Basic-Video-Broadcasting/tree/master/OpenLive-Web"
        className="github"
      ></a>
      <div className="role-container">
        <CustomRadio
          className={classes.radio}
          value="host"
          checked={stateCtx.config.host}
          onClick={handleChange}
        ></CustomRadio>
        <CustomRadio
          className={classes.radio}
          value="audience"
          checked={!stateCtx.config.host}
          onClick={handleChange}
        ></CustomRadio>
      </div>
      <Box
        marginTop="92"
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <FormControl className={clsx(classes.input, classes.grid)}>
          <InputLabel htmlFor="channelName">Enter a channel name</InputLabel>
          <Input
            id="channelName"
            name="channelName"
            value={stateCtx.config.channelName}
            onChange={(evt) => {
              const PATTERN = /^[a-zA-Z0-9!#$%&()+\-:;<=.>?@[\]^_{}|~,\s]{1,64}$/
              const value = PATTERN.test(evt.target.value)
              if (value && evt.target.value.length < 64) {
                mutationCtx.updateConfig({ channelName: evt.target.value })
              } else {
                mutationCtx.updateConfig({ channelName: '' })
              }
            }}
          />
        </FormControl>
        <FormControl className={classes.grid}>
          <Button
            onClick={handleClick}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Start Live Streaming
          </Button>
        </FormControl>
      </Box>
    </Box>
  )
}
