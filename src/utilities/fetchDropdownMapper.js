import { Services } from "services";

export const fetchDropdownMapper = (ServiceInstance = Services) => {
  return async (url, map = { value: "value", label: "label" }) => {
    const res = await ServiceInstance.get(url);
    const list = res?.data?.data || [];
    return list.map((val) => ({
      value: val?.[map.value] ?? val?.value ?? val?.id,
      label: val?.[map.label] ?? val?.label ?? val?.name,
    }));
  };
};
