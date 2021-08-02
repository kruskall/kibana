/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, {
  useContext,
  createElement,
  createContext,
  ComponentType,
  FC,
  ReactElement,
} from 'react';
import { CanvasServices, CanvasServiceProviders, services } from '.';

export interface WithServicesProps {
  services: CanvasServices;
}

const defaultContextValue = {
  embeddables: {},
  search: {},
};

export const ServicesContext = createContext<CanvasServices>(defaultContextValue as CanvasServices);

export const useServices = () => useContext(ServicesContext);
export const useEmbeddablesService = () => useServices().embeddables;
export const useLabsService = () => useServices().labs;
export const withServices = <Props extends WithServicesProps>(type: ComponentType<Props>) => {
  const EnhancedType: FC<Props> = (props) =>
    createElement(type, { ...props, services: useServices() });
  return EnhancedType;
};

export const LegacyServicesProvider: FC<{
  providers?: Partial<CanvasServiceProviders>;
  children: ReactElement<any>;
}> = ({ providers = {}, children }) => {
  const specifiedProviders: CanvasServiceProviders = { ...services, ...providers };
  const value = {
    embeddables: specifiedProviders.embeddables.getService(),
    search: specifiedProviders.search.getService(),
    labs: specifiedProviders.labs.getService(),
  };
  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
};
