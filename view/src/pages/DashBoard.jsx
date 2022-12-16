import React, { Component } from 'react';
import { Row, Col, Card, Upload, message, Tooltip, Popconfirm } from 'antd';
import {
  FolderAddOutlined,
  InboxOutlined,
  FileOutlined,
  HddOutlined,
  DeleteOutlined,
  SettingOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import ProjectForm from '../components/forms/ProjectForm';
import { projectService } from '../service';
import './DashBoard.less';

class DashBoard extends Component {
  state = {
    context: window.context,
    visible: false,
    loading: false,
    listData: [],
    stageData: null,
  };

  async componentWillMount() {
    await this.fetchProjects();
  }

  showCreateForm = () => {
    this.setState({
      stageData: null,
      visible: true,
    });
  };

  closeProjectForm = () => {
    this.setState({
      visible: false,
    });
  };

  confirmProjectForm = async (values) => {
    this.setState({
      loading: true,
    });
    const apiName = this.state.stageData ? 'updateProject' : 'createProject';
    const res = await projectService[apiName]({
      uniqId: this.state.stageData && this.state.stageData.uniqId,
      projectName: values.projectName,
      description: values.description,
      globalProxy: values.globalProxy,
    });

    this.setState({
      loading: false,
    });

    if (res.success) {
      this.setState(
        {
          visible: false,
        },
        () => {
          this.fetchProjects();
        },
      );
    }
  };

  deleteProject = async (uniqId) => {
    await projectService.deleteProject({ uniqId });
    await this.fetchProjects();
  };

  fetchProjects = async () => {
    const res = await projectService.getProjectList();
    this.setState({
      listData: res.data || [],
    });

    // set project size with async
    projectService.getProjectStatisticsList().then((res) => {
      if (res.success && res.data) {
        this.setState({
          listData: res.data || [],
        });
      }
    });
  };

  updateProject = async (value) => {
    this.setState({
      stageData: value,
      visible: true,
    });
  };

  downloadProject = (value) => {
    location.href = projectService.getDownloadAddress({
      uniqId: value.uniqId,
    });
  };

  uploadProps = () => {
    return {
      accept: 'text',
      action: projectService.uploadServer,
      showUploadList: false,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status === 'done') {
          if (info.file.response.success) {
            message.success(`${info.file.name} file uploaded successfully`);
          } else {
            message.error(info.file.response.message);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
  };

  renderProjectList() {
    const { listData } = this.state;

    return listData.map((item, index) => {
      return (
        <Col span={8} key={index}>
          <div className="content">
            <Card
              title={item.description}
              data-accessbilityid={`dashboard-content-card-${index}`}
              bordered={false}
              style={{ color: '#000' }}
            >
              <Row type="flex">
                <Col span={24} className="main-icon">
                  <a href={`/project/${item.projectName}`}>
                    <InboxOutlined />
                  </a>
                </Col>
                <Row type="flex" className="sub-info">
                  <Col span={15} key={item.projectName}>
                    {item.projectName}
                    <span className="main-info">
                      <FileOutlined />
                      {item.capacity && item.capacity.count}
                      <HddOutlined />
                      {item.capacity && item.capacity.size}
                    </span>
                  </Col>
                  <Col span={9} style={{ textAlign: 'right' }}>
                    <Tooltip title={__i18n('更新项目')}>
                      <SettingOutlined
                        className="setting-icon"
                        onClick={() => {
                          return this.updateProject(item);
                        }}
                      />
                    </Tooltip>
                    {this.props.experimentConfig.isOpenDownloadAndUpload ? (
                      <span>
                        <Upload name={item.uniqId} {...this.uploadProps()}>
                          <UploadOutlined className="setting-icon" />
                        </Upload>
                        <DownloadOutlined
                          className="setting-icon"
                          onClick={() => {
                            return this.downloadProject(item);
                          }}
                        />
                      </span>
                    ) : null}
                    <Popconfirm
                      title={__i18n('确定删除？')}
                      onConfirm={() => {
                        return this.deleteProject(item.uniqId);
                      }}
                      okText={__i18n('确定')}
                      cancelText={__i18n('取消')}
                    >
                      <DeleteOutlined className="delete-icon" />
                    </Popconfirm>
                  </Col>
                </Row>
              </Row>
            </Card>
          </div>
        </Col>
      );
    });
  }

  render() {
    return (
      <div className="dashboard">
        <Row type="flex" justify="center">
          <Col span={22}>
            <Row type="flex">
              {this.renderProjectList()}
              <Col span={8}>
                <div className="content">
                  <Card title={__i18n('添加项目')} bordered={false} style={{ color: '#000' }}>
                    <Row type="flex">
                      <Col span={24} className="main-icon">
                        <FolderAddOutlined data-accessbilityid="dashboard-folder-add" onClick={this.showCreateForm} />
                      </Col>
                      <Row type="flex" className="sub-info blank"></Row>
                    </Row>
                  </Card>
                </div>
              </Col>
            </Row>
          </Col>
          <ProjectForm
            visible={this.state.visible}
            onCancel={this.closeProjectForm}
            onOk={this.confirmProjectForm}
            loading={this.state.loading}
            stageData={this.state.stageData}
          />
        </Row>
      </div>
    );
  }
}

export default DashBoard;
