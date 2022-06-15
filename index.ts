import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class Request {
  // axios 实例
  instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    // 拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (config.method === 'get' || config.method === 'delete') {
          config.params = {
            ...config.params,
            timestamp: new Date().valueOf() /* 解决GET请求缓存问题 */
          };
        }
        return config;
      },
      (err) => Promise.reject(err)
    )
    this.instance.interceptors.response.use(
      (response) => {
        const res = response.data;
        if (res && res.error_code !== 0) {
          console.log(11111);
          return res;
        }
        return res;
      },
      (error) => {
        let message = ''
        if (error && error.response) {
          message = "请求错误"
        }
        alert(message)
        return Promise.reject(error);
      }
    )
  }
  request<T>(config: AxiosRequestConfig<T>): Promise<T> {
      return this.instance.request<any, T>(config)
  }
}

const request = new Request({
  baseURL: '/',
  timeout: 20000,
  withCredentials: true, // 请求是携带cookie
});

export const $get = <T>(url: string, params?: T, headers?: T): Promise<T> => {
  return request.request({
    url,
    method: 'GET',
    params,
    headers: headers || {}
  });
}

export const $post = <T>(url: string, data?: T, headers?: T): Promise<T> => {
  return request.request({
    url,
    method: 'POST',
    data,
    headers: headers || {}
  });
};

export default Request
