import { HttpInterceptorFn } from '@angular/common/http';

import { accessTokenAddress } from '../services/auth.service';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem(accessTokenAddress);

  if (!accessToken) {
    return next(req);
  }

  const clonedReq = req.clone({
    headers: req.headers.set('Authorization', "Bearer " + accessToken)
  });

  return next(clonedReq);
};
