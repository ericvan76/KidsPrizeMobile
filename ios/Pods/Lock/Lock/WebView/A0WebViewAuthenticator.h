// A0WebViewAuthenticator.h
//
// Copyright (c) 2015 Auth0 (http://auth0.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#import <UIKit/UIKit.h>
#import <Lock/A0BaseAuthenticator.h>

NS_ASSUME_NONNULL_BEGIN

FOUNDATION_EXPORT NSString * const A0WebViewAuthenticatorTitleBarTintColor;
FOUNDATION_EXPORT NSString * const A0WebViewAuthenticatorTitleBarBarTintColor;
FOUNDATION_EXPORT NSString * const A0WebViewAuthenticatorTitleTextColor;
FOUNDATION_EXPORT NSString * const A0WebViewAuthenticatorTitleTextFont;

@class A0Lock;

@interface A0WebViewAuthenticator : A0BaseAuthenticator

- (instancetype)initWithConnectionName:(NSString *)connectionName lock:(A0Lock *)lock;

@property (copy, nonatomic) NSString *localizedCancelButtonTitle;

@end

NS_ASSUME_NONNULL_END
