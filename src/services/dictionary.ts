import { useMutation, useQuery } from '@tanstack/react-query';

import { message } from 'antd';

/**
 * 按type分组查询字典列表
 */
export const useListType = () => {
    return useQuery([], () => fetch('/dict/listType').then((response) => response.json()));
};

/**
 * 查询单个字典值
 */
export const useSingleDict = (id: number) => {
    return useQuery([], () => fetch(`/dict/${id}`).then((response) => response.json()));
};

/**
 * 按单个type查询字典列表
 */
export const useListSingleType = (
    clickType: string,
    page: number,
    limit: number,
    code?: string,
    name?: string,
) => {
    let url = `/dict?type=${clickType}&page=${page}&limit=${limit}`;
    if (code) {
        url += `&code=${code}`;
    }
    if (name) {
        url += `&name=${name}`;
    }
    const { data, isLoading, refetch } = useQuery([clickType, page, limit], async () =>
        fetch(url).then((response) => response.json()),
    );
    return {
        listSingleTypeData: data,
        listSingleTypeLoading: isLoading,
        listSingleTypeRefetch: refetch,
    };
};

/**
 * 批量删除字典
 */
export const useDelDicts = () => {
    return useMutation(async (ids: number[]) => {
        fetch(`/dict`, {
            method: 'delete',
            body: JSON.stringify({ ids }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        })
            .then((res) => {
                if (res) message.success('删除成功');
            })
            .catch((err) => {
                message.error(err.message);
            });
    });
};

/**
 * 更新单个字典值
 */
export const useUpdateDict = () => {
    return useMutation(async (params) => {
        fetch(`/dict`, {
            method: 'PATCH',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        })
            .then((res) => {
                if (res) message.success('更新成功');
            })
            .catch((err) => {
                message.error(err.message);
            });
    });
};

/**
 * 新建单个字典值
 */
export const useCreateDict = () => {
    return useMutation(async (params) => {
        fetch(`/dict`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        })
            .then((res) => {
                if (res) message.success('添加成功');
            })
            .catch((err) => {
                message.error(err.message);
            });
    });
};
